package project.floread.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.floread.dto.BookDTO;
import project.floread.dto.ResponseDTO;
import project.floread.model.BookEntity;
import project.floread.service.BookService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("book")
@AllArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("/test")
    public ResponseEntity<?> testBook() {
        String str = bookService.testService(); //테스트 서비스
        List<String> list = new ArrayList<>();
        list.add(str);
        ResponseDTO<String> response = ResponseDTO.<String>builder().data(list).build();
        return ResponseEntity.ok().body(response);
    }

    @PostMapping
    public ResponseEntity<?> createBook(@AuthenticationPrincipal String userId, @RequestBody BookDTO bookDTO) {
        try {
            System.out.println("userId = " + userId);
            //DTO를 entity로 변형
            BookEntity bookEntity = BookDTO.toEntity(bookDTO);

            //Id를 null 로 초기화
            bookEntity.setId(null);

            //auth token으로 받은 userid를 가짐
            bookEntity.setUserId(userId);

            //서비스를 이용하여 생성
            List<BookEntity> bookEntityList = bookService.create(bookEntity);

            //DTO로 변형 자바스트림으로 엔티티를 DTO로 변환
            //.collect(Collectors.toList()는 스트림의 요소를 리스트로 변환
            List<BookDTO> bookDTOList = bookEntityList.stream().map(BookDTO::new).collect(Collectors.toList());

            //빌더 패턴 사용하여서 만듦
            ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().data(bookDTOList).build();

            return ResponseEntity.ok().body(responseDTO);
        } catch (Exception e) {
            //에러 보내기
            String error = e.getMessage();
            ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping
    public ResponseEntity<?> retrieveBookList(@AuthenticationPrincipal String userId) {
        System.out.println("userId = " + userId);
        //userid로 책 리스트 가져오기
        List<BookEntity> bookEntityList = bookService.retrieve(userId);

        List<BookDTO> bookDTOList = bookEntityList.stream().map(BookDTO::new).collect(Collectors.toList());

        ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().data(bookDTOList).build();

        return  ResponseEntity.ok().body(responseDTO);
    }

    @PutMapping
    public ResponseEntity<?> updateBook(@AuthenticationPrincipal String userId, @RequestBody BookDTO bookDTO) {
        BookEntity bookEntity = BookDTO.toEntity(bookDTO);

        bookEntity.setUserId(userId);

        List<BookEntity> bookEntityList = bookService.update(bookEntity);

        List<BookDTO> bookDTOList = bookEntityList.stream().map(BookDTO::new).collect(Collectors.toList());

        ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().data(bookDTOList).build();

        return ResponseEntity.ok().body(responseDTO);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBook(@AuthenticationPrincipal String userId, @RequestBody BookDTO bookDTO) {
        try {

            //엔티티로 변환
            BookEntity bookEntity = BookDTO.toEntity(bookDTO);

            bookEntity.setUserId(userId);

            List<BookEntity> bookEntityList = bookService.delete(bookEntity);

            List<BookDTO> bookDTOList = bookEntityList.stream().map(BookDTO::new).collect(Collectors.toList());

            ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().data(bookDTOList).build();

            return ResponseEntity.ok().body(responseDTO);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().error(error).build();

            return ResponseEntity.badRequest().body(responseDTO);
        }

    }
}
