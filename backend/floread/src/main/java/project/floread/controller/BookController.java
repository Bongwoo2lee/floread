package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import project.floread.config.auth.LoginUser;
import project.floread.config.auth.dto.SessionUser;
import project.floread.model.Book;
import project.floread.model.User;
import project.floread.repository.BookRepository;
import project.floread.repository.UserRepository;
import project.floread.service.BookService;
import project.floread.service.EmotionService;

import java.io.*;
import java.nio.file.Files;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
//@RequestMapping(value = "/upload", method = RequestMethod.POST)
//@ResponseBody
public class BookController {

    private final BookService bookService;

    @GetMapping("/books/save")
    public String create(/*@RequestPart MultipartFile files, */ Authentication authentication) throws IOException {

        //현재 로그인 중인 유저 userId가져오기
        String userId = authentication.getName();

        Book book = new Book();
        //업로드 이벤트 없이 그냥 있는 텍스트 파일로 하는 법
        File file = new File("/Users/seokbeomlee/Desktop/Project/floread/backend/floread/src/main/java/project/floread/controller/개구리 왕자.txt");
        DiskFileItem fileItem = new DiskFileItem("file", Files.probeContentType(file.toPath()), false, file.getName(), (int) file.length(), file.getParentFile());
        InputStream input = new FileInputStream(file);
        OutputStream os = fileItem.getOutputStream();
        IOUtils.copy(input, os);

        MultipartFile files = new CommonsMultipartFile(fileItem);
        //여기까지

        //원본 파일 이름 저장
        String sourceFileName = files.getOriginalFilename();

        //원본파일확장자면
        String sourceFileNameExtension = FilenameUtils.getExtension(sourceFileName);

        //확장자빼고
        String title = FilenameUtils.removeExtension(sourceFileName);

        //저장될 파일
        File destinationBook;
        String destinationBookName;
        String bookUrl = "/Users/seokbeomlee/Desktop/Project/floread/book/";
        //있을 경우 패스
        try {
            do {
                //파일명은 사용자auth2아이디_원본파일.txt로 저장됨
                destinationBookName = title + '_' + userId + '.' + sourceFileNameExtension;

                //파일 경로
                destinationBook = new File(bookUrl + destinationBookName);

                //부모디렉토리가 존재하지 않으면 생성
                destinationBook.getParentFile().mkdirs();
                //파일 이동
                files.transferTo(destinationBook);

                //데이터베이스에 저장
                book.setFileName(destinationBookName);
                book.setUrl(bookUrl + destinationBookName);
                bookService.join(book, userId);
            } while (destinationBook.exists());
        } catch (IllegalStateException e) {
            return "books-save";
        }
        return "books-save";
    }

    @GetMapping("/read")
    public String Read(Authentication authentication) {
        String userId = authentication.getName();
        List<String> url = bookService.findUrl(userId);
        for (String s : url) {
            System.out.println(s);
        }
        return "index";
    }
}
