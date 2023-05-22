package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.floread.model.Book;
import project.floread.repository.UserRepository;
import project.floread.service.BookService;

import java.io.File;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RequiredArgsConstructor
@RestController
public class BookController {

    private final BookService bookService;
    private final UserRepository userRepository;


    @PostMapping("/upload")
    public ResponseEntity<String> create(@RequestPart("file") MultipartFile[] files,  Authentication authentication) throws IOException {
        //현재 로그인 중인 유저 userId가져오기
        try {
            String userId = authentication.getName();
            System.out.println(userId);
        }
        catch (NullPointerException e) {
            return ResponseEntity.ok("로그인을 먼저해주세요.");
        }
        String userId = authentication.getName();

        for (MultipartFile file : files) {
            if(file.isEmpty()) {
                System.out.println("파일 없음");
                return ResponseEntity.ok("Files uploaded fail");
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

                    //파일명은 사용자auth2아이디_원본파일.txt로 저장됨
                    destinationBookName = title + '_' + userId + '.' + sourceFileNameExtension;

                    //파일 경로
                    destinationBook = new File(bookUrl + destinationBookName);

                    //부모디렉토리가 존재하지 않으면 생성
                    destinationBook.getParentFile().mkdirs();
                    //파일 이동
                    file.transferTo(destinationBook);

                    //데이터베이스에 저장
                    book.setFileName(destinationBookName);
                    book.setUrl(bookUrl + destinationBookName);
                    bookService.join(book, userId);

                } catch (IllegalStateException e) {
                    System.out.println("파일 존재");
                }

            } catch (IOException e) {

                System.out.println("저장 실패");
                return ResponseEntity.ok("Files uploaded fail");
            }
        }
        return ResponseEntity.ok("Files uploaded successfully");
        //있을 경우 패스
    }


    //임시로 책내용 출력
    @GetMapping("/read")
    public String Read(Authentication authentication) {
        String userId = authentication.getName();
        List<String> url = bookService.findUrl(userId);


        for (String s : url) {
            System.out.println(s);

            //파일 출력시 할 내용
            //File file = new File(s);
        }
        return "book";
    }


    public String  getBook(Authentication authentication, Model model) {
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
