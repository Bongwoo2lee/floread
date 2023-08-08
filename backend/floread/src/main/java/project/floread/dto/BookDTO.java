package project.floread.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.floread.model.BookEntity;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class BookDTO {
    //DTO는 data transfer object로 데이터를 클라에 리턴할 때 사용
    //비즈니스 로직을 추가x, 에러메시지 보낼때 사용
    private String id;
    private String title;
    private String url;

    public BookDTO(final BookEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.url = entity.getUrl();
    }


    //엔티티로 변환
    public static BookEntity toEntity(final BookDTO dto) {
        return BookEntity.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .url(dto.getUrl())
                .build();
    }
}
