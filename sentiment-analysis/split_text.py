# 책 텍스트 받아서 문장 단위로 쪼개기 - 1열 n행 csv로 저장
from konlpy.tag import Kkma
import csv

def split_sentences(text):
    kkma = Kkma()
    sentences = kkma.sentences(text)
    return sentences

# txt파일로 읽었을 때 임의로 줄바꾸는 문제
# 그냥 \n 을 다 제거 하면? 원래 줄 바꾸는 영역이 구분 안될듯

# text = " 새침하게 흐린 품이 눈이 올 듯하더니 눈은 아니 오고 얼다가 만 비가 추적추적 내리는 날이었다. 이날이야말로 동소문 안에서 인력거꾼 노릇을 하는 김첨지에게는 오래간만 에도 닥친 운수 좋은 날이었다. 문안에(거기도 문밖은 아니지만) 들어간답시는 앞집 마마님을 전찻길까지 모셔다 드린 것을 비롯으로 행여나 손님이 있을까 하고 정류장에서 어정어정하며내리는 사람 하나하나에게 거의 비는듯한 눈결을 보내고 있다가 마침내 교원인 듯한 양복쟁이를 동광학교(東光學校)까지 태워다 주기로 되었다."

file = open('data/booksample1.txt', 'r',encoding='UTF8')    #인코딩 안바꾸면 오류
text = str(file.readlines())

sentences = split_sentences(text)

for i in sentences:
    print(i)
    
#csv파일 생성, 쓰기
with open('output.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    for item in sentences:
        writer.writerow([item])