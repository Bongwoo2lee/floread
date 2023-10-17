package project.floread.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Music {

    @Id @GeneratedValue
    @Column(name = "music_id")
    private Long id;

    private String fileName;

    private String url;

    private String genre;

    @OneToMany(mappedBy = "music", cascade = CascadeType.ALL)
    private List<MusicEmotion> musicEmotions;
}
