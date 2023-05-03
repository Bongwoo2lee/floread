package project.floread.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Emotion {

    @Id @GeneratedValue
    @Column(name = "emotion_id")
    private Long id;

    private String emotion;

    @OneToMany(mappedBy = "emotion", cascade = CascadeType.ALL)
    private List<MusicEmotion> musicEmotions = new ArrayList<>();

    @OneToMany(mappedBy = "emotion", cascade = CascadeType.ALL)
    private List<BookEmotion> bookEmotions = new ArrayList<>();
}
