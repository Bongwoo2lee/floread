package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Emotion;
import project.floread.repository.EmotionRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EmotionService {

    private final EmotionRepository emotionRepository;

//    @Transactional
//    public List<String> Print(String emotion) {
//        List<String> urls = emotionRepository.findUrlByEmotion(emotion);
//
//        return urls;
//    }

    @Transactional
    public Emotion FindId(String emotion) {
        return emotionRepository.findByEmotion(emotion);
    }
}
