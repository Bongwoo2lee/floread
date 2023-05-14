# Floread
**감성 분석** 기반 전자책 음악 추천 서비스

### Contributors
|안근우|강인우|염진봉|이석범|
|----|----|----|----|
|**[kgeunwo77](https://github.com/kgeunwo77)**|**[kiw331](https://github.com/kiw331)**|**[jinbong-yeom](https://github.com/jinbong-yeom)**|**[stoneTiger0912](https://github.com/stoneTiger0912)**|

<br>

## How to use
TBD

### Requirements
TBD
<br>

## **sentiment-analysis model**
### **data**: [AI-Hub](https://aihub.or.kr/) 제공
+ 감성 대화 말뭉치
+ 한국어 감정 정보가 포함된 단발성 대화 데이터셋
+ 한국어 감정 정보가 포함된 연속적 대화 데이터셋 
   
*학습데이터 처리 과정: [**EDA**](https://github.com/Bongwoo2lee/floread/blob/main/sentiment-analysis/EDA.ipynb)

### Performance
|Model|　　학습 데이터|acc|size(mb)|비고|
|------|:------|---|:----:|---|
|kcelectra-v3|병합데이터셋-v2|0.679|416.25| |
|kobert-v4|병합데이터셋-v2|0.681|351.79| |
|kcelectra-v2|병합데이터셋|0.681|416.25| |
|kcelectra-v1|감성 대화 말뭉치|0.584|-| |
|koelectra-v1|병합데이터셋|0.601|-| |
|kobert-v3|병합데이터셋|0.674|351.79| |
|kobert-v2|단발성 대화 데이터셋|0.545|351.79| |
|kobert-v1|감성 대화 말뭉치|0.591|351.79| |  

*정확도는 테스트 데이터셋을 4:1로 분할하여 측정  
*Fine-tuning 코드는 [/sentiment-analysis](https://github.com/Bongwoo2lee/floread/tree/main/sentiment-analysis)에서 `train_[모델이름].ipynb`으로 찾을 수 있음


<!-- Throughput per 100  또는 Processing time pe
최신순
평가 데이터는 split한거 언급
-->
<br>

## License
TBD
<br>


## Reference
- [Kobert](https://github.com/SKTBrain/KoBERT)
- [KoELECTRA](https://github.com/monologg/KoELECTRA)
- [KcELECTRA](https://github.com/Beomi/KcELECTRA)

