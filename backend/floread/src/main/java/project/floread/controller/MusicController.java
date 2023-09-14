package project.floread.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import project.floread.service.MusicService;

import java.util.LinkedHashMap;

@RequiredArgsConstructor
@Controller
@Slf4j
public class MusicController {

    private final MusicService musicService;

    @CrossOrigin(origins = "http://localhost:3000")
    @ResponseBody
    @RequestMapping(value = "/video/{emotion}", method = RequestMethod.POST)
    public ResponseEntity<LinkedHashMap> getAudio(@PathVariable String emotion) throws Exception {
        LinkedHashMap param = new LinkedHashMap();
        param.put("emotion", emotion);
        //위에 스트링으로 만들어준 객체를 답변을 위한 해쉬맵 객체에 넣어
        //프론트로 보내기 위해 적재
        return ResponseEntity.ok().body(musicService.playAudio(param));
    }
}
