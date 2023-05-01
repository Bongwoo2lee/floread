package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import project.floread.config.auth.LoginUser;
import project.floread.config.auth.dto.SessionUser;
import project.floread.model.Book;
import project.floread.model.CurrentUser;
import project.floread.model.User;
import project.floread.model.UserAdapter;
import project.floread.repository.BookRepository;
import project.floread.repository.FindUserRepository;
import project.floread.repository.UserRepository;
import project.floread.service.BookService;

import java.io.*;
import java.nio.file.Files;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
//@RequestMapping(value = "/upload", method = RequestMethod.POST)
//@ResponseBody
public class BookController {

    private final BookService bookService;
    private final UserRepository userRepository;

    @GetMapping("/books/save")
    public String create(/*@RequestPart MultipartFile files, */ @CurrentUser User user) throws IOException {
        System.out.println(user.getId());
        Book book = new Book();
        File file = new File("/Users/seokbeomlee/Desktop/Project/floread/backend/floread/src/main/java/project/floread/controller/성냥팔이 소녀.txt");
        DiskFileItem fileItem = new DiskFileItem("file", Files.probeContentType(file.toPath()), false, file.getName(), (int) file.length(), file.getParentFile());
        InputStream input = new FileInputStream(file);
        OutputStream os = fileItem.getOutputStream();
        IOUtils.copy(input, os);

        MultipartFile files = new CommonsMultipartFile(fileItem);

        String sourceFileName = files.getOriginalFilename();
        String sourceFileNameExtension = FilenameUtils.getExtension(sourceFileName);

        FilenameUtils.removeExtension(sourceFileName);

        File destinationBook;
        String destinationBookName;
        String bookUrl = "/Users/seokbeomlee/Desktop/Project/floread/book/";

        do {
            destinationBookName = RandomStringUtils.randomAlphanumeric(32) + '.' + sourceFileNameExtension;
            destinationBook = new File(bookUrl + destinationBookName);
        } while (destinationBook.exists());

        destinationBook.getParentFile().mkdirs();
        files.transferTo(destinationBook);

        book.setFileName(destinationBookName);
        book.setUrl(bookUrl+destinationBookName);
        //book.setUser(user);
        bookService.join(book);

        return "books-save";
    }
}
