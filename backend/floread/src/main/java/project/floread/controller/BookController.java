package project.floread.controller;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.floread.model.*;
import project.floread.service.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;



@RequiredArgsConstructor
@RestController
public class BookController {

    private final BookService bookService;
    private final AuthenticationService authenticationService;
    private final KafkaSampleProducerService kafkaSampleProducerService;

    private static String hashString(String input, String algorithm) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
            byte[] hashBytes = messageDigest.digest(input.getBytes());

            StringBuilder stringBuilder = new StringBuilder();
            for (byte b : hashBytes) {
                stringBuilder.append(String.format("%02x", b));
            }
            return stringBuilder.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/delete/{originName}")
    public ResponseEntity<String> deleteBook(@PathVariable String originName) {
        System.out.println(originName);
        String userId = authenticationService.getAuthentication().getName();
        System.out.println(userId);
        bookService.delete(originName, userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body("OK");
    }

    @PostMapping("/upload")
    public ResponseEntity<String> create(@RequestPart("files") MultipartFile[] files) throws IOException {
        String userId = authenticationService.getAuthentication().getName();
        System.out.println(userId);
        for (MultipartFile file : files) {
            //저장후 보낼 파일url을 담을 변수
            String fileUrl = null;

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
                //원본파일확장자명
                String sourceFileNameExtension = FilenameUtils.getExtension(sourceFileName);
                //확장자빼고
                String title = FilenameUtils.removeExtension(sourceFileName);

                //저장될 파일
                File destinationBook;
                String destinationBookName;
                String currentUrl = System.getProperty("user.dir");
                File currentFolder = new File(currentUrl);
                File parentFolder = currentFolder.getParentFile();
                String bookUrl = parentFolder.getAbsolutePath()+"/book/";
                System.out.println(bookUrl);
                try {
                    assert title != null;
                    String hashedPassword = hashString(title, "SHA-256");
                    //파일명은 해싱.html로 저장됨
                    destinationBookName = hashedPassword + ".txt";

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
                    fileUrl = book.getUrl();
                    

                } catch (IllegalStateException e) {
                    System.out.println("파일 존재");
                    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body("파일 존재");
                }

            } catch (IOException e) {

                System.out.println("저장 실패");
                return ResponseEntity.status(HttpStatus.NOT_EXTENDED)
                        .body("저장 실패");
            }
            kafkaSampleProducerService.sendMessage(fileUrl);
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body("OK");
    }


    @GetMapping("/mypage")
    public String getMyPage() {
        //아이디 찾기
        String userId = authenticationService.getAuthentication().getName();
        System.out.println("userId: "+ userId);

        //아이디로 책 찾기
        List<Book> books = bookService.findBooks(userId);
        for (Book book : books) {
            System.out.println("book = " + book.getOriginName());
        }

        //보낼 형식
        List<SendBook> sendBookList = new ArrayList<>();

        //책 별로 감정 리스트
        for (Book book : books) {
            //음악 감성 리스트
            List<String> emotions = bookService.findEmotions(book);
            System.out.println("book = " + book.getFileName());
            System.out.println("emotions = " + emotions.get(0));
            //책에 대한 감정 리스트 연결
            SendBook sendBook = new SendBook(book.getOriginName(), book.getUrl(), emotions);
            sendBookList.add(sendBook);
        }

        Gson gson = new Gson();
        System.out.println(gson.toJson(sendBookList).getClass().getName());

        return gson.toJson(sendBookList);
    }


    @GetMapping("/book/{title}")
    public ResponseEntity<Resource> Read(@PathVariable String title) throws IOException {
        Book book = bookService.findByOriginName(title);
        String filePath = book.getUrl();
        System.out.println(filePath);
        //파일 가져오기
        //반환으로 파일을 보내는데 파일이 html이어서 바로보이게
        File file = new File(filePath);

        if (file.exists()) {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } else {
            // 파일이 존재하지 않을 경우 에러 응답
            return ResponseEntity.notFound().build();
        }
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
