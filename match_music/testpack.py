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

# # 연결 확인
# if conn.is_connected():
#     print('MySQL에 연결되었습니다.')

# class SSHManager:
#     """
#     usage:
#         >>> import SSHManager
#         >>> ssh_manager = SSHManager()
#         >>> ssh_manager.create_ssh_client(hostname, username, password)
#         >>> ssh_manager.send_command("ls -al")
#         >>> ssh_manager.send_file("/path/to/local_path", "/path/to/remote_path")
#         >>> ssh_manager.get_file("/path/to/remote_path", "/path/to/local_path")
#         ...
#         >>> ssh_manager.close_ssh_client()
#     """
#     def __init__(self):
#         self.ssh_client = None

#     def create_ssh_client(self, hostname, username, password):
#         """Create SSH client session to remote server"""
#         if self.ssh_client is None:
#             self.ssh_client = paramiko.SSHClient()
#             self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#             self.ssh_client.connect(hostname, username=username, password=password)
#         else:
#             print("SSH client session exist.")

#     def close_ssh_client(self):
#         """Close SSH client session"""
#         self.ssh_client.close()

#     def send_file(self, local_path, remote_path):
#         """Send a single file to remote path"""
#         try:
#             with SCPClient(self.ssh_client.get_transport()) as scp:
#                 scp.put(local_path, remote_path, preserve_times=True)
#         except SCPException:
#             raise SCPException.message

#     def get_file(self, remote_path, local_path):
#         """Get a single file from remote path"""
#         try:
#             with SCPClient(self.ssh_client.get_transport()) as scp:
#                 scp.get(remote_path, local_path)
#         except SCPException:
#             raise SCPException.message

#     def send_command(self, command):
#         """Send a single command"""
#         stdin, stdout, stderr = self.ssh_client.exec_command(command)
#         return stdout.readlines()

# consumer = KafkaConsumer(
#     bootstrap_servers='49.143.47.128:9092',
#     group_id='floread',
#     auto_offset_reset='latest',
# )

# consumer.subscribe('book')

# for message in consumer:

#     print(message.value.decode('utf-8'))
#     ssh_client = paramiko.SSHClient()
#     ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#     ssh_client.connect(config.get('ssh', 'host'), config.get('ssh', 'port'), config.get('ssh', 'user'), config.get('ssh', 'password'))
#     sftp_client = ssh_client.open_sftp()

#     # 원격 파일 가져오기
#     time.sleep(2)
#     remote_path = message.value.decode('utf-8')
#     fileName = str(remote_path).split('/')[-1]
#     local_path = str(os.getcwd()) +'/'+ fileName
#     print(remote_path, local_path)
#     sftp_client.get(remote_path, local_path)

#     # 커서 생성
#     cursor = conn.cursor()

#     # 쿼리 1 실행
#     emotion = "{}".format(res_emo)
#     query1 = "SELECT emotion_id FROM Emotion where `emotion` = "+ emotion
#     cursor.execute(query1)
#     result1 = cursor.fetchall()
#     emotion_id = 0
#     for row in result1:
#         emotion_id = row[0]

#     # 쿼리 2 실행
#     # 쿼리실행할때는 ''로 감싸줘야함 "SELECT book_id FROM Book where `fileName` = 'test.txt'" 
#     # fileName의 경우 뒤에 '는 자동으로 있어서 앞에만 하면 됨
#     query_file = fileName.replace("'", "")
#     print(query_file)
#     query2 = "SELECT book_id FROM Book where `fileName` = '"+ query_file +"'"
#     cursor.execute(query2)
#     result2 = cursor.fetchall()
#     book_id = 0
#     for row in result2:
#         book_id = row[0]
#         print(book_id)
#     #insert query
#     query3 = "INSERT INTO BookEmotion (emotion_id, book_id) VALUES (%s, %s)"
#     values = (emotion_id, book_id)
#     cursor.execute(query3, values)
#     # 변경사항 커밋
#     conn.commit()
#     print(cursor.rowcount, "record inserted")

#     # 연결 및 커서 닫기
#     cursor.close()
#     conn.close()

#     # SFTP 클라이언트 종료
#     sftp_client.close()

#     # SSH 클라이언트 연결 종료
#     ssh_client.close()