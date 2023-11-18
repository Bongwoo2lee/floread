package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Emotion;
import project.floread.repository.EmotionRepository;
import project.floread.repository.MusicEmotionRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EmotionService {

    private final EmotionRepository emotionRepository;
    private final MusicEmotionRepository musicEmotionRepository;

}
