package com.sentinelassess.repository;

import com.sentinelassess.entity.QuickPrepBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuickPrepBookmarkRepository extends JpaRepository<QuickPrepBookmark, Long> {
    List<QuickPrepBookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<QuickPrepBookmark> findByUserIdAndTopicId(Long userId, Long topicId);
    void deleteByUserIdAndTopicId(Long userId, Long topicId);
    boolean existsByUserIdAndTopicId(Long userId, Long topicId);
}
