import re
import torch
from torch import nn
from torch.utils.data import Dataset
from kobert_tokenizer import KoBERTTokenizer
import gluonnlp as nlp
import numpy as np
import time
import requests

import matplotlib.font_manager as fm
import matplotlib.pyplot as plt
import datetime

# matplotlib 글꼴 설정
fontpath = r'sentiment-analysis/NPSfont_regular.ttf'
font_name = fm.FontProperties(fname=fontpath, size=50).get_name()
plt.rc('font', family=font_name)

# 이미지 파일의 경로 
image_file_path = ''

def save_vis(res):
    global image_file_path
    
    # 중립은 그래프에서 빠지도록
    del res['중립']
    
    # 키값으로 딕셔너리를 정렬하고 첫번째, 두번째로 큰 키를 추출
    sorted_items = sorted(res.items(), key=lambda item: item[1], reverse=True)
    first_key, second_key = sorted_items[0][0], sorted_items[1][0]
    print(first_key, second_key)

    # 만약 가장 큰 키가 '놀람'이면 두번쨰 값을 디스플레이
    if first_key == '놀람':
        first_key = second_key
        
    # first_key의 인덱스 찾기
    index_of_first_key = list(res.keys()).index(first_key)       
     
    # 라벨 설정
    labels_for_display = [''] * len(res)
    labels_for_display[index_of_first_key] = first_key  
          
    # 원형 그래프 그리기
    _, ax1 = plt.subplots()

    # 가운데 부분을 뚤린 원형으로 설정
    wedgeprops = {'width': 0.3, 'edgecolor': 'white'}  # 가운데 부분 속성

    # 원형 그래프 그리기
    outer_colors = plt.cm.Set3(range(len(res)))  # 바깥 부분 색상
    inner_colors = ['white'] * len(res)  # 가운데 부분 색상
    

    # 원형 그래프에 labels 파라미터를 추가해서 바깥에 최대값을 갖는 키의 이름만 출력되도록 함
    wedges, texts, autotexts = ax1.pie(
        list(res.values()),
        labels=labels_for_display,  # <--- 이 부분을 수정함
        autopct='%1.1f%%', 
        startangle=90,
        colors=outer_colors, 
        wedgeprops=wedgeprops,
        labeldistance= 0.95 #그래프, 텍스트 거리
        )
    
    # 감정 글씨만 키우기
    for text in texts:
        text.set_fontsize(30)

    ax1.pie([1], radius=0.7, colors=inner_colors, wedgeprops=wedgeprops)  # 가운데 뚤린 원형 추가
    
    # 범례 추가
    ax1.legend(wedges, list(res.keys()), title="감성", loc="best", bbox_to_anchor=(0.67, 1.35), ncol=2) #bbox_to_anchor: 범례 위치

    # 가운데 부분에 텍스트 추가
    plt.text(0, 0, '감성 분석 결과', ha='center', va='center', fontsize=17)

    # 가운데 뚤린 원형 그래프 출력
    plt.axis('equal')
    
    image_file_path = ''
    
    try:
        # 날짜, 시간으로 파일 저장
        current_datetime = datetime.datetime.now().strftime("%m%d%H%M%S")
        image_file_path = './sentiment-analysis/res_image/{0}.png'.format(current_datetime)
        plt.savefig(image_file_path, dpi=300, bbox_inches='tight')
        
    except Exception as e:
        print("이미지 저장 실패",e, sep='\ns')
        # 연결 및 커서 닫기
    

def runKobert(raw_file):
    
    raw_text = ''
    
    if raw_file[-4:]=='html':
        with open(raw_file, 'r', encoding='utf-8') as html_file:
            raw_text = html_file.read()
        print("\n html 파일 읽기", type(raw_text))
    
    else: 
        file = open(raw_file, 'r',encoding='utf-8')    #인코딩 안바꾸면 오류
        raw_text = file.readlines()
        print("\n txt 파일 읽기",  type(raw_text))
    
    textsum = '' 
    if isinstance(raw_text, list):
        #줄바꿈제거
        for sentence in raw_text:
            sentence = sentence.replace("\n", "")
            textsum += sentence
    else:
        textsum=raw_text
        
    print("총 길이",len(textsum))

    #(한자) 제거    
    textsum = re.sub('\([^)]*\)|[一-龥]', '', textsum)
    
    #문장 단위로 분리: . ”로 끝날때마다 묶어주기
    text = []
    s, e = 0, 0
    isopen = False #쌍따옴표 안에 글자인지 확인
    for i in range(len(textsum)-1):
        if textsum[i]=='“':
            isopen = True
            continue
            
        if (textsum[i]=='.' and textsum[i+1]!='”' and isopen==False) or textsum[i]=='”':
            e = i+1
            text.append(textsum[s:e].strip())
            s = e
            isopen = False
            
    if len(text)==0:
        print("텍스트 확인 필요")
        return -1


    #감성분석 하기
    print("===========================================",len(text),"문장 감성분석 시작")
    start_time = time.time()
    
    res = {'행복':0,'불안':0,'놀람':0, '슬픔':0,'분노':0,'중립':0}
    
    # db 삽입을 위해서 리턴할 때 영어로 변경
    res_eng = {'행복':'happy','불안':'tense','슬픔':'sad','분노':'angry'}

    
    for sentence in text:
        res[predict(sentence)] += 1
    end_time = time.time()  # 종료 시간 저장
    print("소요시간: {}s".format(round(end_time - start_time, 2)))  # 실행 시간 출력
    print("분석 결과: ",res)
    
    # 분석결과 이미지로 저장
    save_vis(res)
    
    # 음악 매칭을 위해 중립, 놀람 태그가 제거된 딕셔너리 생성
    res_copied = res.copy()
    
    if '중립' in res_copied:    
        del res_copied['중립']
    del res_copied['놀람']
    
    # .이나 ""로 구분된 문장이 없을 경우
    if max(res, key=res.get) == 0:
        print("텍스트 확인 필요")
        return -1

    sorted_res = sorted(res_copied.items(), key=lambda x: x[1], reverse=True)
    first_emo = sorted_res[0][0]
    second_emo = sorted_res[1][0]
    
    # 1번째와 2번쨰로 많은 감성의 비율 차이가 10% 내외 일때
    #if (sorted_res[0][1]-sorted_res[1][1])/(len(text)-res.get("중립", None)) < 0.1:
    if (sorted_res[0][1]-sorted_res[1][1])/(len(text)) < 0.05:
        print("2중 태그: ",first_emo, second_emo)
        return (res_eng[first_emo], res_eng[second_emo])

    print("최다 빈도: ",first_emo,end=', ')
    return (res_eng[first_emo],)   #투플로 인식되려면 ,
    
#region kovert-v9 모델 불러오기
tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')
vocab = nlp.vocab.BERTVocab.from_sentencepiece(tokenizer.vocab_file, padding_token='[PAD]')
tok = tokenizer.tokenize

#device = torch.device("cpu")
device = torch.device("cuda:0")

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
#model_path = 'sentiment-analysis/model/kobert-v6.pt' #(cmd 위치 기준)
model_path = 'sentiment-analysis/model/kobert-v9.pt' #(cmd 위치 기준)
model = torch.load(model_path)
#model = model.to('cpu')

max_len = 64
batch_size = 64

#예측함수(감정 문자열 리턴)
def predict(sentence):
    dataset = [[sentence, '0']]
    test = BERTDataset(dataset, 0, 1, tok, vocab, max_len, True, False)
    test_dataloader = torch.utils.data.DataLoader(test, batch_size=batch_size, num_workers=0)
    model.eval()
    answer = 0
    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_dataloader):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)
        valid_length= valid_length
        label = label.long().to(device)
        out = model(token_ids, valid_length, segment_ids)
        for logits in out:
            logits = logits.detach().cpu().numpy()
            answer = np.argmax(logits)
            
    emos = ('행복','불안','놀람', '슬픔','분노','중립')
    return emos[answer]

#endregion

####################################################################################################################

from kafka import KafkaConsumer
import paramiko
from scp import SCPClient, SCPException
import os
import time
import mysql.connector
import configparser

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
        …
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

# db에 태그 삽입
def insert_tag(emotion, cursor, fileName):
    #쿼리1
    query1 = "SELECT emotion_id FROM Emotion where `emotion` = "+ emotion
    cursor.execute(query1)
    result1 = cursor.fetchall()

    emotion_id = 0
    for row in result1:
        emotion_id = row[0]
        print("emotion_id: ",emotion_id)

    # 쿼리 2 실행
    # 쿼리실행할때는 ''로 감싸줘야함 "SELECT book_id FROM Book where `fileName` = 'test.txt'" 
    # fileName의 경우 뒤에 '는 자동으로 있어서 앞에만 하면 됨
    query_file = fileName.replace("'", "")
    #print(query_file)
    query2 = "SELECT book_id, originName FROM Book where `fileName` = '"+ query_file +"'"
    cursor.execute(query2)
    result2 = cursor.fetchall()
    book_id = 0
    
    # 책이름
    originName=''
    for row in result2:
        book_id = row[0]
        originName = row[1]
        
    #insert query
    query3 = "INSERT INTO BookEmotion (emotion_id, book_id) VALUES (%s, %s)"
    values = (emotion_id, book_id)
    cursor.execute(query3, values)
    
    return originName, book_id 


def start_program():
    global image_file_path
    global consumer
    
    for message in consumer:

        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(config.get('ssh', 'host'), config.get('ssh', 'port'), config.get('ssh', 'user'), config.get('ssh', 'password'))
        sftp_client = ssh_client.open_sftp()
        
        try:
            # 원격 파일 가져오기
            remote_path = message.value.decode('utf-8')
            fileName = str(remote_path).split('/')[-1]
            local_path = os.getcwd().replace("\\", "/") +'/'+ fileName #슬레시가 반대로 나오는거 바꿔주기
            sftp_client.get(remote_path, local_path)
            
            # 커서 생성
            cursor = conn.cursor()

            # 쿼리 1 실행
            analysis_res = runKobert(local_path)
            
            # 빈문자열 & 감성있는 문장이 없을 때
            if analysis_res == -1:   continue
            
            emotion1 = "'{}'".format(analysis_res[0])
            
            #쿼리1,2,3
            originName, book_id = insert_tag(emotion1,cursor, fileName)
            
            #이중 태그
            if len(analysis_res)==2:
                print("test: 이중태그")
                emotion2 = "'{}'".format(analysis_res[1])
                insert_tag(emotion2, cursor, fileName)
                
                
            #쿼리4
            # 업로드할 파일의 이름 (원하는 파일 이름으로 변경)
            file_name = originName + '.png'
            
            query4 = f"UPDATE Book SET image = '/home/floread/image/{file_name}' WHERE book_id = {book_id};"
            cursor.execute(query4)
            result4 = cursor.fetchall()

            # 변경사항 커밋
            conn.commit()
            print(cursor.rowcount, "record inserted\n")

            # 업로드할 URL
            upload_url = 'http://floread.store:8080/image'
            

            # 파일을 열고 업로드할 준비
            with open(image_file_path, 'rb') as file:
                
                # 파일 및 bookId를 포함하여 POST 요청 보내기
                files = {'file': (file_name, file), 'bookId': str(book_id)}  # book_id를 문자열로 변환

                # POST 요청을 보내어 파일을 업로드
                response = requests.post(upload_url, files=files)
                
            # 서버로부터의 응답 확인
            if response.status_code == 200:
                print('이미지 업로드 성공!')
            else:
                print('이미지 업로드 실패. 응답 코드:', response.status_code)
            
        except Exception as e:
            print(e)
            # 연결 및 커서 닫기
            continue
        
        # 파일 삭제
        print(local_path, "삭제")
        os.remove(local_path)


if __name__ == '__main__':
    start_program()
    