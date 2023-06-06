package project.floread.controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.floread.model.*;
import project.floread.repository.UserRepository;
import project.floread.service.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@RequiredArgsConstructor
@RestController
public class BookController {

    private final EmotionService emotionService;
    private final MusicService musicService;
    private final BookService bookService;
    private final AuthenticationService authenticationService;
    private final KafkaSampleProducerService kafkaSampleProducerService;

    @PostMapping("/upload")
    public ResponseEntity<String> create(@RequestPart("files") MultipartFile[] files) throws IOException {
        String userId = authenticationService.getAuthentication().getName();

        System.out.println(userId);
        for (MultipartFile file : files) {
            if(file.isEmpty()) {
                System.out.println("파일 없음");
                return ResponseEntity.status(HttpStatus.OK)
                        .body("파일 없음");
            }
            try {
                System.out.println(file.getName());
                Book book = new Book();
                //원본 파일 이름 저장
                String sourceFileName = file.getOriginalFilename();
                //원본파일확장자면
                String sourceFileNameExtension = FilenameUtils.getExtension(sourceFileName);
                //확장자빼고
                String title = FilenameUtils.removeExtension(sourceFileName);

                //저장될 파일
                File destinationBook;
                String destinationBookName;
                String bookUrl = System.getProperty("user.dir")+"/../book/";
                System.out.println(bookUrl);
                try {

                    //파일명은 원본파일_아이디.txt로 저장됨
                    destinationBookName = title + '_' + userId + '.' + sourceFileNameExtension;

                    //파일 경로
                    destinationBook = new File(bookUrl + destinationBookName);

                    //부모디렉토리가 존재하지 않으면 생성
                    destinationBook.getParentFile().mkdirs();
                    //파일 이동
                    file.transferTo(destinationBook);

                    //데이터베이스에 저장
                    book.setFileName(destinationBookName);
                    book.setOriginName(title);
                    book.setUrl(bookUrl + destinationBookName);
                    bookService.join(book, userId);
                    kafkaSampleProducerService.sendMessage(book.getUrl());

                } catch (IllegalStateException e) {
                    System.out.println("파일 존재");
                }

            } catch (IOException e) {

                System.out.println("저장 실패");
                return ResponseEntity.status(HttpStatus.OK)
                        .body("저장 실패");
            }
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body("OK");
        //있을 경우 패스
    }


    @GetMapping("/mypage")
    public String getMyPage() {
        System.out.println("dd = ");
        //아이디 찾기
        String userId = authenticationService.getAuthentication().getName();
        System.out.println(userId);

        //아이디로 책 찾기
        List<Book> books = bookService.findBooks(userId);

        //잠시 책이랑 감성이랑 연결
        for (Book book : books) {
            System.out.println("book = " + book.getOriginName());

            BookEmotion bookEmotion = new BookEmotion();
            Emotion emotion = emotionService.FindId("기쁨");
            System.out.println("emotion = " + emotion.getEmotion());

            bookEmotion.setBook(book);
            bookEmotion.setEmotion(emotion);
            System.out.println("bookEmotion = " + bookEmotion.getId());
            bookService.joinEmotion(bookEmotion);
        }


        //보낼 형식
        List<SendBook> sendBookList = new ArrayList<>();
        List<SendMusicEmotion> sendMusicEmotionList = new ArrayList<>();

        //책 별로 제목, url, 음악김성리스트(음악, 감성)
        for (Book book : books) {
            //음악 감성 리스트

            //감성 찾기
            List<Emotion> emotions = bookService.findEmotions(book);


            for (Emotion emotion : emotions) {
                //감성에 대한 음악 찾기
                List<String> musicList = musicService.findByMusic(emotion);

                System.out.println("musicList = " + musicList);

                //감성에 따른 음악 리스트 연결
                SendMusicEmotion sendMusicEmotion = new SendMusicEmotion(emotion.getEmotion(), musicList);
                sendMusicEmotionList.add(sendMusicEmotion);
            }
            SendBook sendBook = new SendBook(book.getOriginName(), book.getUrl(), sendMusicEmotionList);
            System.out.println("sendBook = " + sendBook);
            sendBookList.add(sendBook);
        }
        String aa = sendBookList.toString();
        System.out.println("aa = " + aa);

        Gson gson = new Gson();
        System.out.println(gson.toJson(sendBookList).getClass().getName());

        return gson.toJson(sendBookList);
    }


    //임시로 책내용 출력
    @GetMapping("/read")
    public String Read(Authentication authentication) {
        String userId = authentication.getName();
        System.out.println(userId);
        List<String> url = bookService.findUrl(userId);


        for (String s : url) {
            System.out.println(s);

            //파일 출력시 할 내용
            //File file = new File(s);
        }
        return "book";
    }


    public String getBook(Authentication authentication, Model model) {
        // url 파라미터를 사용하여 파일 경로를 가져오는 로직
        List<Book> books = bookService.findBooks(authentication.getName());
        Book book = books.get(0);
        String filePath = book.getUrl();

        model.addAttribute("filePath", filePath);
        // HTTP 응답 설정
        /*HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        return new ResponseEntity<>(filePath, headers, HttpStatus.OK);*/
        return "book";
    }

    @GetMapping("/book")
    public ResponseEntity<FileSystemResource> getFile(Authentication authentication) throws IOException {
        List<Book> books = bookService.findBooks(authentication.getName());
        Book book = books.get(0);
        String filePath = book.getUrl();
        FileSystemResource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(resource);
    }
}
