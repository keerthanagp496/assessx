package com.sentinelassess.repository;

import com.sentinelassess.entity.QuickPrepQuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuickPrepQuizQuestionRepository extends JpaRepository<QuickPrepQuizQuestion, Long> {
    List<QuickPrepQuizQuestion> findByTopicId(Long topicId);
    List<QuickPrepQuizQuestion> findByTopic_CategoryId(Long categoryId);
}
