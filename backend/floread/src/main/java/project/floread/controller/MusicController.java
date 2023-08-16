package project.floread.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import project.floread.model.Music;
import project.floread.repository.MusicEmotionRepository;
import project.floread.repository.MusicRepository;
import project.floread.service.EmotionService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Controller
@Slf4j
public class MusicController {
    private static final String UPLOADED_FOLDER = "절대경로";
    private final MusicRepository musicRepository;

    private final MusicEmotionRepository musicEmotionRepository;
    private final EmotionService emotionService;
//     '/musics/기쁨' 이면 장르가 기쁨을 가지는 음악의 콘솔에 path를 출력
    @GetMapping("/music/{emotion}")
    public ResponseEntity<List<String>> getMusic(@PathVariable String emotion) {
        System.out.println(emotion);
        List<String> musicUrls = musicEmotionRepository.findByEmotionToMusicUrl(emotion);
        System.out.println(musicUrls);
        return ResponseEntity.ok().body(musicUrls);
    }

    @RequestMapping(value = "/music/{musicId}", method = RequestMethod.GET, produces = {
            MediaType.APPLICATION_OCTET_STREAM_VALUE })
    public ResponseEntity playAudio(HttpServletRequest request, HttpServletResponse response, @PathVariable("musicId") long musicId) throws FileNotFoundException {

        log.info("[downloadRecipientFile]");

        Optional<Music> music = musicRepository.findById(musicId);
        String file = UPLOADED_FOLDER + music.getSoundFile();


        long length = new File(file).length();


        InputStreamResource inputStreamResource = new InputStreamResource( new FileInputStream(file));
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentLength(length);
        httpHeaders.setCacheControl(CacheControl.noCache().getHeaderValue());
        return new ResponseEntity(inputStreamResource, httpHeaders, HttpStatus.OK);
    }
}
