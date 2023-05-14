# 책 텍스트 받아서 문장 단위로 쪼개기 - 1열 n행 csv로 저장
import csv
import re

# txt파일로 읽었을 때 임의로 줄바꾸는 문제
# 그냥 \n 을 다 제거 하면? 원래 줄 바꾸는 영역이 구분 안될듯
# text = " 새침하게 흐린 품이 눈이 올 듯하더니 눈은 아니 오고 얼다가 만 비가 추적추적 내리는 날이었다. 이날이야말로 동소문 안에서 인력거꾼 노릇을 하는 김첨지에게는 오래간만 에도 닥친 운수 좋은 날이었다. 문안에(거기도 문밖은 아니지만) 들어간답시는 앞집 마마님을 전찻길까지 모셔다 드린 것을 비롯으로 행여나 손님이 있을까 하고 정류장에서 어정어정하며내리는 사람 하나하나에게 거의 비는듯한 눈결을 보내고 있다가 마침내 교원인 듯한 양복쟁이를 동광학교(東光學校)까지 태워다 주기로 되었다."
# 줄바꾸면서 띄어쓰기 된 경우는?

file = open('sentiment-analysis/data/booksample1.txt', 'r',encoding='UTF8')    #인코딩 안바꾸면 오류
raw_text = file.readlines()
#print(type(raw_text),raw_text, sep = '\n\n')

textsum = '' 
# 모든 줄바꿈제거
for sentence in raw_text:
    #print("sentence")
    sentence = sentence.replace("\n", "")
    textsum += sentence

# new_text = [re.sub("\n", "", sentence) for sentence in text]

textsum = re.sub('\([^)]*\)|[一-龥]', '', textsum)
# print(textsum)

text = []
s, e = 0, 0
for i in range(len(textsum)):
    if (textsum[i]=='.' and textsum[i+1]!='”' ) or textsum[i]=='”':
        e = i+1
        text.append(textsum[s:e])
        s = e

# 임의로 줄 바꿈 

# for s in text:
#     print(s)

    
#csv파일 생성, 쓰기
with open('sentiment-analysis/data/output.csv', 'w', newline='', encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    for item in text:
        writer.writerow([item])

# from konlpy.tag import Kkma

# def split_sentences(text):
#     kkma = Kkma()
#     sentences = kkma.sentences(text)
#     return sentences
