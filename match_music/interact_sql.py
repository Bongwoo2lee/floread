from kafka import KafkaConsumer
import paramiko
from scp import SCPClient, SCPException
import os
import time
import mysql.connector
import configparser


# # MySQL 서버 정보 설정
# config = configparser.ConfigParser()
# config.read('match_music/config.ini')

# # MySQL 연결 설정
# conn = mysql.connector.connect(
#     host=config.get('mysql', 'host'),
#     port=config.get('mysql', 'port'),
#     database=config.get('mysql', 'database'),
#     user=config.get('mysql', 'user'),
#     password=config.get('mysql', 'password'),
#     charset='utf8'  
# )

# # 연결 확인
# if conn.is_connected():
#     print('MySQL에 연결되었습니다.')

from test_model import runKobert

obj = runKobert("Alice")
obj.greet()  
    
    
    
    