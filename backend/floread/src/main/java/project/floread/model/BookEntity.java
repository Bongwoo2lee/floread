package project.floread.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data //get,set
@Entity
@Table(name = "Book")
public class BookEntity {
    //오브젝트 아이디, 유저아이디, 제목 url
    @Id
    @GeneratedValue(generator = "system-uuid") //제너레이터로 밑의 내용사용
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;
    private String userId;
    private String title;
    private String url;
}
