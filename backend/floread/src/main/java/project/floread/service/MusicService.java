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
        List<String> emotions = (List<String>) param.get("emotion");
        String genre = (String) param.get("genre");

        List<String> resultList = new ArrayList<>();
        if (emotions.size() == 1 || emotions.contains("happy")) {
            resultList.addAll(getMusicListForSingleEmotion(emotions.get(0), genre));
        } else {
            String emotion1 = emotions.get(0);
            String emotion2 = emotions.get(1);



            List<String> tmpList1 = getMusicListForSingleEmotion(emotion1, "none");
            List<String> tmpList2 = getMusicListForSingleEmotion(emotion2, "none");

            tmpList1.retainAll(tmpList2);
            System.out.println("tmpList1 = " + tmpList1);
            resultList.addAll(tmpList1);
        }

        return resultList;
    }

    private List<String> getMusicListForSingleEmotion(String emotion, String genre) {
        Long emotionId = emotionRepository.findByEmotion(emotion);
        List<String> tmpList;

        if (Objects.equals(genre, "none")) {
            tmpList = musicEmotionRepository.findByMusicUrlFromEmotionId(emotionId);
        } else {
            tmpList = musicEmotionRepository.findByMusicUrlFromEmotionIdAAndGenre(emotionId, genre);
        }

        System.out.println("tmpList for emotion " + emotion + " = " + tmpList);

        return tmpList;
    }

        //url만 가져오기
//        for (String emotion : emotions) {
//            Long emotionId = emotionRepository.findByEmotion(emotion);
//            List<String> tmpList = new ArrayList<>();
//            if (Objects.equals(genre, "none")) {
//                tmpList = musicEmotionRepository.findByMusicUrlFromEmotionId(emotionId);
//            }
//            else {
//                tmpList = musicEmotionRepository.findByMusicUrlFromEmotionIdAAndGenre(emotionId, genre);
//            }
//            System.out.println("tmpList = " + tmpList);
//            resultList.addAll(tmpList);
//        }


    // 파일 읽어들이는 메소드
    @SuppressWarnings("resource")
    public String fileToString(File file) throws IOException {
        // 필요한 객체들을 세팅한다.
        String fileString = null;

        try (FileInputStream inputStream = new FileInputStream(file);
             ByteArrayOutputStream byteOutStream = new ByteArrayOutputStream()) {

            int len;
            byte[] buf = new byte[1024];

            while ((len = inputStream.read(buf)) != -1) {
                byteOutStream.write(buf, 0, len);
            }

            byte[] fileArray = byteOutStream.toByteArray();

            Base64.Encoder encoder = Base64.getEncoder();
            byte[] encoderResult = encoder.encode(fileArray);

            fileString = new String(encoderResult);
        }

        return fileString;
    }
}
