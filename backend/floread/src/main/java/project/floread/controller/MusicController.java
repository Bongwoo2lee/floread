package project.floread.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import project.floread.model.Book;
import project.floread.security.JwtAuthenticationFilter;
import project.floread.service.BookService;
import project.floread.service.MusicService;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.List;

@RequiredArgsConstructor
@Controller
@Slf4j
@CrossOrigin(origins = "http://floread.store:3000")
public class MusicController {

    private final MusicService musicService;
    private final BookService bookService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @PostMapping("/video/{title}")
    public ResponseEntity<List<String>> getAudio(@PathVariable String title, Principal authentication) throws Exception {
        LinkedHashMap param = new LinkedHashMap();
        // String userId = authentication.getName();
        // System.out.println("오디오");
        // System.out.println("title = " + title);
        // System.out.println("userId = " + userId);

        Book book = bookService.findByOriginNameAndUser(userId, title);
        String genre = book.getGenre();
        List<String> emotions = bookService.findEmotions(book);


        String image = book.getImage();


        param.put("emotion", emotions);
        param.put("genre", genre);
        param.put("imgae", image);
        //위에 스트링으로 만들어준 객체를 답변을 위한 해쉬맵 객체에 넣어
        //프론트로 보내기 위해 적재
        return ResponseEntity.ok().body(musicService.playAudio(param));
    }

    @CrossOrigin(origins = "http://floread.store:3000")
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        // MP3 파일의 경로 설정
        String filePath = "/home/floread/Music/"+filename+".mp3";
        System.out.println("filePath = " + filePath);
        Path path = Paths.get(filePath);

        // PathResource를 사용하여 Resource 객체 생성
        Resource resource = new PathResource(path);


        if (resource.exists() && resource.isReadable()) {
            String contentType = "audio/mpeg"; // MP3 파일의 MIME 타입

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .body(resource);
        } else {
            // 파일을 찾을 수 없거나 읽을 수 없는 경우 404 에러 반환
            return ResponseEntity.notFound().build();
        }
    }
}
