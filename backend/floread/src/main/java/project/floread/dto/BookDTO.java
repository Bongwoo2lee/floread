package project.floread.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.floread.model.Book;

import java.io.Serializable;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class BookDTO implements Serializable {
    //DTO는 data transfer object로 데이터를 클라에 리턴할 때 사용
    //비즈니스 로직을 추가x, 에러메시지 보낼때 사용
    private String title;
    private String url;
    private String genre;
    private List<String> emotions;

//    public BookDTO(String title, String url, String genre, List<String> emotions) {
//        this.title = title;
//        this.url = url;
//        this.genre = genre;
//        this.emotions = emotions;
//    }


//    //엔티티로 변환
//    public static Book toEntity(final BookDTO dto) {
//        return Book.builder()
//                .id(dto.getId())
//                .title(dto.getTitle())
//                .url(dto.getUrl())
//                .build();
//    }
}
