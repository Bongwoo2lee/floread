package project.floread.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.floread.dto.BookDTO;
import project.floread.dto.ResponseDTO;
import project.floread.model.BookEntity;
import project.floread.service.BookService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("book")
@AllArgsConstructor
public class BookController {
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody BookDTO bookDTO) {
        try {
            //임시 유저id
            String temporaryUserId = "temporary-user";

            //DTO를 entity로 변형
            BookEntity bookEntity = BookDTO.toEntity(bookDTO);

            bookEntity.setId(null);

            bookEntity.setUserId(temporaryUserId);

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
    public ResponseEntity<?> retrieveBookList() {
        String temporaryUserId = "temporary-user";

        List<BookEntity> bookEntityList = bookService.retrieve(temporaryUserId);

        List<BookDTO> bookDTOList = bookEntityList.stream().map(BookDTO::new).collect(Collectors.toList());

        ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().data(bookDTOList).build();

        return  ResponseEntity.ok().body(responseDTO);
    }

    @PutMapping
    public ResponseEntity<?> updateBook(@RequestBody BookDTO bookDTO) {
        String temporaryUserId = "temporary-user";

        BookEntity bookEntity = BookDTO.toEntity(bookDTO);

        bookEntity.setUserId(temporaryUserId);

        List<BookEntity> bookEntityList = bookService.update(bookEntity);

        List<BookDTO> bookDTOList = bookEntityList.stream().map(BookDTO::new).collect(Collectors.toList());

        ResponseDTO<BookDTO> responseDTO = ResponseDTO.<BookDTO>builder().data(bookDTOList).build();

        return ResponseEntity.ok().body(responseDTO);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBook(@RequestBody BookDTO bookDTO) {
        try {
            String temporaryUserId = "temporary-user";

            //엔티티로 변환
            BookEntity bookEntity = BookDTO.toEntity(bookDTO);

            bookEntity.setUserId(temporaryUserId);

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
