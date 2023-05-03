package project.floread.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

//책과 감정은 다대다이므로 중간에 풀어줄 테이블
@Entity
@Getter
@NoArgsConstructor
public class BookEmotion {
    @Id
    @GeneratedValue
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "book_id")
    private Music book;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "emotion_id")
    private Emotion emotion;
}
