package project.floread.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import project.floread.repository.EmotionRepository;
import project.floread.repository.MusicEmotionRepository;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

@Service
@AllArgsConstructor
public class MusicService {

    private final EmotionRepository emotionRepository;
    private final MusicEmotionRepository musicEmotionRepository;


    public List<String> playAudio(HashMap param) throws Exception {
        //파일을 파일객체에 넣는다/
        List<String> emotions = (List<String>) param.get("emotion");
        String genre = (String) param.get("genre");

        List<String> resultList = new ArrayList<>();
        //url만 가져오기
        for (String emotion : emotions) {
            Long emotionId = emotionRepository.findByEmotion(emotion);
            List<String> tmpList = new ArrayList<>();
            if (Objects.equals(genre, "none")) {
                tmpList = musicEmotionRepository.findByMusicUrlFromEmotionId(emotionId);
            }
            else {
                tmpList = musicEmotionRepository.findByMusicUrlFromEmotionIdAAndGenre(emotionId, genre);
            }
            System.out.println("tmpList = " + tmpList);
            resultList.addAll(tmpList);
        }
        return resultList;
    }

    // 파일 읽어들이는 메소드
    @SuppressWarnings("resource")
    public String fileToString(File file) throws IOException {

        //필요한 객체들을 세팅한다.
        //스트링으로 최종변환한 값을 담는 객체
        String fileString = new String();
        //읽은 파일을 인풋 스트림으로 활용하기 위한 객체
        FileInputStream inputStream =  null;
        //읽은 스트림을 바이트배열로 만들기 위한 객체
        ByteArrayOutputStream byteOutStream = null;

        //파일을 인풋 스트림 객체에 넣는다.
        inputStream = new FileInputStream(file);
        byteOutStream = new ByteArrayOutputStream();
        int len = 0;
        //바이트 배열임시생성 (왜 1024인지는 모른다 안다면 댓글부탁 드립니다.)
        byte[] buf = new byte[1024];

        //읽어들인 스트림이 False(-1)이 아닐때까지 루프를 돌린다.
        while ((len = inputStream.read(buf)) != -1) {
            //byte배열로 데이터를 입출력하는기 위해 읽어들인다.
            byteOutStream.write(buf, 0, len);

        }

        //바이트배열에 읽은 스트림을 넣는다.
        byte[] fileArray = byteOutStream.toByteArray();

        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encoderResult = null;
        //읽어들인 바이트배열을 통신을위한base64로 인코딩해서 바이트배열에 넣는다.
        encoderResult = encoder.encode(fileArray);

        //해당 바이트 배열을 스트링으로 변환한다.
        fileString = new String(encoderResult);
        inputStream.close();
        byteOutStream.close();
        return fileString;

    }
}
