package project.floread.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

//음악과 감정은 다대다이므로 연결할 중간 테이블
@Entity
@Getter
@NoArgsConstructor
public class MusicEmotion {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "music_id")
    private Music music;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "emotion_id")
    private Emotion emotion;
}
