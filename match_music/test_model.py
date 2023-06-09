import re
import pandas as pd
import torch
from torch import nn
from torch.utils.data import Dataset
from kobert_tokenizer import KoBERTTokenizer
import gluonnlp as nlp
import numpy as np

def runKobert(raw_file):
    with open(raw_file, 'r', encoding='utf-8') as html_file:
        raw_text = html_file.read()
        
    print("파일읽기", len(raw_text), type(raw_text))
    
    #줄바꿈제거
    textsum = '' 
    for sentence in raw_text:
        sentence = sentence.replace("\n", "")
        textsum += sentence
        
    #(한자) 제거    
    textsum = re.sub('\([^)]*\)|[一-龥]', '', textsum)
    
    # 줄바꿈제거
    text = []
    s, e = 0, 0
    for i in range(len(textsum)):
        if (textsum[i]=='.' and textsum[i+1]!='”' ) or textsum[i]=='”':
            e = i+1
            text.append(textsum[s:e])
            s = e
            
    #문장 단위로 분리: . ”로 끝날때마다 묶어주기
    text = []
    s, e = 0, 0
    for i in range(len(textsum)):
        if (textsum[i]=='.' and textsum[i+1]!='”' ) or textsum[i]=='”':
            e = i+1
            text.append(textsum[s:e])
            s = e
    #데이터프레임으로
    df = pd.DataFrame(text, columns=['sentence'])
    
    emos = ('행복','불안','놀람', '슬픔','분노','중립')
    res = {'행복':0,'불안':0,'놀람':0, '슬픔':0,'분노':0,'중립':0}

    for index, data in df.iterrows():
        res[emos[predict(data['sentence'])]] += 1
    print(res)

    res_copied = res.copy()
    del res_copied['중립']
    del res_copied['놀람']
    res_emo = max(res_copied, key=res_copied.get)

    print(res_emo)
    return res_emo
    
# file_path = '../sentiment-analysis/data/booksample1.txt'
#file_path = 'sentiment-analysis/data/booksample1.txt' #(cmd 위치 기준)

#file = open(file_path, 'r',encoding='UTF8')    #인코딩 안바꾸면 오류

#raw_text = file.readlines()

#줄바꿈제거
# textsum = '' 
# for sentence in raw_text:
#     sentence = sentence.replace("\n", "")
#     textsum += sentence

# #(한자) 제거    
# textsum = re.sub('\([^)]*\)|[一-龥]', '', textsum)

# #문장 단위로 분리: . ”로 끝날때마다 묶어주기
# text = []
# s, e = 0, 0
# for i in range(len(textsum)):
#     if (textsum[i]=='.' and textsum[i+1]!='”' ) or textsum[i]=='”':
#         e = i+1
#         text.append(textsum[s:e])
#         s = e
        
# #데이터프레임으로
# df = pd.DataFrame(text, columns=['sentence'])

#모델 불러오기
tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')
vocab = nlp.vocab.BERTVocab.from_sentencepiece(tokenizer.vocab_file, padding_token='[PAD]')
tok = tokenizer.tokenize

#device = torch.device("cpu")

class BERTClassifier(nn.Module):
    def __init__(self,
                 bert,
                 hidden_size = 768,
                 num_classes=6, #클래스 수 조정
                 dr_rate=None,
                 params=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate
                 
        self.classifier = nn.Linear(hidden_size , num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)
    
    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)
        
        _, pooler = self.bert(input_ids = token_ids, token_type_ids = segment_ids.long(), attention_mask = attention_mask.float().to(token_ids.device))
        if self.dr_rate:
            out = self.dropout(pooler)
        return self.classifier(out)

class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer,vocab, max_len,
                 pad, pair):
   
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len,vocab=vocab, pad=pad, pair=pair)
        
        self.sentences = [transform([i[sent_idx]]) for i in dataset]
        self.labels = [np.int32(i[label_idx]) for i in dataset]

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))
         
    def __len__(self):
        return (len(self.labels))
    
#model_path = '../sentiment-analysis/model/kobert-v6.pt'
model_path = 'sentiment-analysis/model/kobert-v6.pt' #(cmd 위치 기준)
model = torch.load(model_path)
model = model.to('cpu')

max_len = 64
batch_size = 64

#예측함수
def predict(sentence):
    dataset = [[sentence, '0']]
    test = BERTDataset(dataset, 0, 1, tok, vocab, max_len, True, False)
    test_dataloader = torch.utils.data.DataLoader(test, batch_size=batch_size, num_workers=0)
    model.eval()
    answer = 0
    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_dataloader):
        token_ids = token_ids.long().cpu()    #벡엔드에서 cpu로
        segment_ids = segment_ids.long().cpu()  #벡엔드에서 cpu로
        valid_length= valid_length
        label = label.long().cpu() 
        out = model(token_ids, valid_length, segment_ids)
        for logits in out:
            logits = logits.detach().cpu().numpy()
            answer = np.argmax(logits)
    return answer

####################################################################################################################

from kafka import KafkaConsumer
import paramiko
from scp import SCPClient, SCPException
import os
import time
import mysql.connector
import configparser
import sys

#mysql 서버 다른 파일에 놓고 import해서 사용하면 됨

# MySQL 서버 정보 설정
config = configparser.ConfigParser()
config.read('match_music/config.ini')

# MySQL 연결 설정
conn = mysql.connector.connect(
    host=config.get('mysql', 'host'),
    port=config.get('mysql', 'port'),
    database=config.get('mysql', 'database'),
    user=config.get('mysql', 'user'),
    password=config.get('mysql', 'password'),
    charset='utf8'  
)

# 연결 확인
if conn.is_connected():
    print('MySQL에 연결되었습니다.')

class SSHManager:
    """
    usage:
        >>> import SSHManager
        >>> ssh_manager = SSHManager()
        >>> ssh_manager.create_ssh_client(hostname, username, password)
        >>> ssh_manager.send_command("ls -al")
        >>> ssh_manager.send_file("/path/to/local_path", "/path/to/remote_path")
        >>> ssh_manager.get_file("/path/to/remote_path", "/path/to/local_path")
        ...
        >>> ssh_manager.close_ssh_client()
    """
    def __init__(self):
        self.ssh_client = None

    def create_ssh_client(self, hostname, username, password):
        """Create SSH client session to remote server"""
        if self.ssh_client is None:
            self.ssh_client = paramiko.SSHClient()
            self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.ssh_client.connect(hostname, username=username, password=password)
        else:
            print("SSH client session exist.")

    def close_ssh_client(self):
        """Close SSH client session"""
        self.ssh_client.close()

    def send_file(self, local_path, remote_path):
        """Send a single file to remote path"""
        try:
            with SCPClient(self.ssh_client.get_transport()) as scp:
                scp.put(local_path, remote_path, preserve_times=True)
        except SCPException:
            raise SCPException.message

    def get_file(self, remote_path, local_path):
        """Get a single file from remote path"""
        try:
            with SCPClient(self.ssh_client.get_transport()) as scp:
                scp.get(remote_path, local_path)
        except SCPException:
            raise SCPException.message

    def send_command(self, command):
        """Send a single command"""
        stdin, stdout, stderr = self.ssh_client.exec_command(command)
        return stdout.readlines()

consumer = KafkaConsumer(
    bootstrap_servers=config.get('Kafka', 'host'),
    group_id=config.get('Kafka', 'group_id'),
    auto_offset_reset='latest',
)

consumer.subscribe('book')

for message in consumer:

    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh_client.connect(config.get('ssh', 'host'), config.get('ssh', 'port'), config.get('ssh', 'user'), config.get('ssh', 'password'))
    sftp_client = ssh_client.open_sftp()
    

    try:
        # 원격 파일 가져오기
        remote_path = message.value.decode('utf-8')
        fileName = str(remote_path).split('/')[-1]
        local_path = str(os.getcwd()) +'/'+ fileName
        print(remote_path, local_path)
        sftp_client.get(remote_path, local_path)

        # 커서 생성
        cursor = conn.cursor()
        
        #러닝 하기
        print("러닝 시작")

        # 쿼리 1 실행
        #emotion = "'행복'"
        emotion = "'{}'".format(runKobert(local_path))
        query1 = "SELECT emotion_id FROM Emotion where `emotion` = "+ emotion
        cursor.execute(query1)
        result1 = cursor.fetchall()

        emotion_id = 0
        for row in result1:
            emotion_id = row[0]
            print(emotion_id)

        # 쿼리 2 실행
        # 쿼리실행할때는 ''로 감싸줘야함 "SELECT book_id FROM Book where `fileName` = 'test.txt'" 
        # fileName의 경우 뒤에 '는 자동으로 있어서 앞에만 하면 됨
        query_file = fileName.replace("'", "")
        print(query_file)
        query2 = "SELECT book_id FROM Book where `fileName` = '"+ query_file +"'"
        cursor.execute(query2)
        result2 = cursor.fetchall()
        book_id = 0
        for row in result2:
            book_id = row[0]
            print(book_id)
        #insert query
        query3 = "INSERT INTO BookEmotion (emotion_id, book_id) VALUES (%s, %s)"
        values = (emotion_id, book_id)
        cursor.execute(query3, values)
        # 변경사항 커밋
        conn.commit()
        print(cursor.rowcount, "record inserted")

        # 파일 삭제
        os.remove(local_path)
        
    except Exception as e:
        print(e)
        # 연결 및 커서 닫기
        continue
