import re
import pandas as pd
import torch
from torch import nn
from torch.utils.data import Dataset
from kobert_tokenizer import KoBERTTokenizer
import gluonnlp as nlp
import numpy as np

file_path ='booksample1.txt'
file = open(file_path, 'r',encoding='UTF8')    #인코딩 안바꾸면 오류
raw_text = file.readlines()

#줄바꿈제거
textsum = '' 
for sentence in raw_text:
    sentence = sentence.replace("\n", "")
    textsum += sentence

#(한자) 제거    
textsum = re.sub('\([^)]*\)|[一-龥]', '', textsum)

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
    
model_path = '../sentiment-analysis/model/kobert-v5.pt'
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


emos = ('행복','불안','놀람', '슬픔','분노','중립')
res = {'행복':0,'불안':0,'놀람':0, '슬픔':0,'분노':0,'중립':0}

for index, data in df.iterrows():
    res[emos[predict(data['sentence'])]] += 1
print(res)
