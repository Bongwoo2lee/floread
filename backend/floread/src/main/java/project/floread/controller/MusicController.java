package project.floread.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import project.floread.model.Music;
import project.floread.repository.MusicEmotionRepository;
import project.floread.repository.MusicRepository;
import project.floread.service.CustomerService;
import project.floread.service.EmotionService;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Controller
@Slf4j
public class MusicController {
    private final MusicRepository musicRepository;

    private final MusicEmotionRepository musicEmotionRepository;
    private final EmotionService emotionService;
    private final CustomerService customerService;


    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping("/music")
    public void fileDownloadOnWebBrowser(HttpServletRequest req, HttpServletResponse res) throws Exception {
        File f = new File("/Users/seokbeomlee/Desktop/Project/refactor/floread/backend/music/angry.mp3");

        String name = null;
        String browser = req.getHeader("User-agent");

        if(browser.contains("MSIE") || browser.contains("Trident") || browser.contains("Chrome")) {
            name = URLEncoder.encode(f.getName(), "UTF-8").replaceAll("\\+", "%20");
        } else {
            name = new String(f.getName().getBytes("UTF-8"), "ISO-8859-1");
        }

        res.setHeader("Content-Disposition", "attachment;filename=\"" + name + "\"");
        res.setContentType("application/octer-stream");
        res.setHeader("Content-Transfet-Encoding", "binary;");

        try(FileInputStream fis = new FileInputStream(f);
            ServletOutputStream sos = res.getOutputStream();) {
            byte[] b = new byte[1024];
            int data = 0;

            while ((data=(fis.read(b, 0, b.length))) != -1) {
                sos.write(b, 0, data);
            }

            sos.flush();
        } catch (Exception e) {
            throw e;
        }
    }

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/audio")
    public ResponseEntity<ResourceRegion> getVideo(@RequestHeader HttpHeaders headers) throws IOException {
        logger.info("VideoController.getVideo");

        UrlResource video = new UrlResource("http://local/Users/seokbeomlee/Desktop/Project/refactor/floread/backend/music/angry.mp3");
        ResourceRegion resourceRegion;

        final long chunkSize = 1000000L;
        long contentLength = video.contentLength();

        Optional<HttpRange> optional = headers.getRange().stream().findFirst();
        HttpRange httpRange;
        if (optional.isPresent()) {
            httpRange = optional.get();
            long start = httpRange.getRangeStart(contentLength);
            long end = httpRange.getRangeEnd(contentLength);
            long rangeLength = Long.min(chunkSize, end - start + 1);
            resourceRegion = new ResourceRegion(video, start, rangeLength);
        } else {
            long rangeLength = Long.min(chunkSize, contentLength);
            resourceRegion = new ResourceRegion(video, 0, rangeLength);
        }

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaTypeFactory.getMediaType(video).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resourceRegion);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @ResponseBody
    @RequestMapping(value = "/video", method = RequestMethod.POST)
    public ResponseEntity<LinkedHashMap> getAudio() throws Exception{
        LinkedHashMap param = new LinkedHashMap();
        //위에 스트링으로 만들어준 객체를 답변을 위한 해쉬맵 객체에 넣어
        //프론트로 보내기 위해 적재
        return ResponseEntity.ok().body(customerService.playAudio(param));
    }

//     '/musics/기쁨' 이면 장르가 기쁨을 가지는 음악의 콘솔에 path를 출력
//    @GetMapping("/music/{emotion}")
//    public ResponseEntity<List<String>> getMusic(@PathVariable String emotion) {
//        System.out.println(emotion);
//        List<String> musicUrls = musicEmotionRepository.findByEmotionToMusicUrl(emotion);
//        System.out.println(musicUrls);
//        return ResponseEntity.ok().body(musicUrls);
//    }
//
//    @RequestMapping(value = "/music/{musicId}", method = RequestMethod.GET, produces = {
//            MediaType.APPLICATION_OCTET_STREAM_VALUE })
//    public ResponseEntity playAudio(HttpServletRequest request, HttpServletResponse response, @PathVariable("musicId") long musicId) throws FileNotFoundException {
//
//        log.info("[downloadRecipientFile]");
//
//        Optional<Music> music = musicRepository.findById(musicId);
//        String file = UPLOADED_FOLDER + music.getSoundFile();
//
//
//        long length = new File(file).length();
//
//
//        InputStreamResource inputStreamResource = new InputStreamResource( new FileInputStream(file));
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentLength(length);
//        httpHeaders.setCacheControl(CacheControl.noCache().getHeaderValue());
//        return new ResponseEntity(inputStreamResource, httpHeaders, HttpStatus.OK);
//    }
}
