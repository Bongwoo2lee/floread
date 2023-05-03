package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import project.floread.service.EmotionService;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class MusicController {

    private final EmotionService emotionService;
    // /musics/기쁨 이면 장르가 기쁨을 가지는 음악의 콘솔에 path를 출력
    @GetMapping("/musics/{input}")
    public String Print(@PathVariable String input) {
        List<String> urls = emotionService.Print(input);
        for (String url : urls) {
            System.out.println(url);
        }
        return "index";
    }
}
