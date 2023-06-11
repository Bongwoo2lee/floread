package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import project.floread.repository.MusicEmotionRepository;
import project.floread.service.EmotionService;
import java.util.List;

@RequiredArgsConstructor
@Controller
public class MusicController {

    private final MusicEmotionRepository musicEmotionRepository;
    private final EmotionService emotionService;
    // '/musics/기쁨' 이면 장르가 기쁨을 가지는 음악의 콘솔에 path를 출력
    @GetMapping("/music/{emotion}")
    public ResponseEntity<List<String>> getMusic(@PathVariable String emotion) {
        System.out.println(emotion);
        List<String> musicUrls = musicEmotionRepository.findByEmotionToMusicUrl(emotion);
        System.out.println(musicUrls);
        return ResponseEntity.ok().body(musicUrls);
    }
}
