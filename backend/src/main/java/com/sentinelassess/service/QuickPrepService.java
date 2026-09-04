package com.sentinelassess.service;

import com.sentinelassess.dto.QuickPrepDtos.*;
import com.sentinelassess.entity.*;
import com.sentinelassess.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class QuickPrepService {
    private final QuickPrepCategoryRepository categoryRepo;
    private final QuickPrepTopicRepository topicRepo;
    private final QuickPrepQuizQuestionRepository quizRepo;
    private final QuickPrepProgressRepository progressRepo;
    private final QuickPrepBookmarkRepository bookmarkRepo;
    private final UserRepository userRepo;

    public QuickPrepService(QuickPrepCategoryRepository categoryRepo,
                            QuickPrepTopicRepository topicRepo,
                            QuickPrepQuizQuestionRepository quizRepo,
                            QuickPrepProgressRepository progressRepo,
                            QuickPrepBookmarkRepository bookmarkRepo,
                            UserRepository userRepo) {
        this.categoryRepo = categoryRepo;
        this.topicRepo = topicRepo;
        this.quizRepo = quizRepo;
        this.progressRepo = progressRepo;
        this.bookmarkRepo = bookmarkRepo;
        this.userRepo = userRepo;
    }

    public List<QuickPrepCategory> getCategories() {
        return categoryRepo.findAllByOrderByDisplayOrderAsc();
    }

    public List<QuickPrepTopic> getTopics(Long categoryId) {
        if (categoryId != null && categoryId > 0) {
            return topicRepo.findByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(categoryId);
        }
        return topicRepo.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public QuickPrepTopic getTopicById(Long id) {
        return topicRepo.findById(id).orElseThrow(() -> new RuntimeException("Topic not found: " + id));
    }

    public List<QuickPrepTopic> searchTopics(String query) {
        if (query == null || query.trim().isEmpty()) {
            return topicRepo.findByActiveTrueOrderByDisplayOrderAsc();
        }
        String pattern = "%" + query.trim().toLowerCase() + "%";
        return topicRepo.searchTopics(pattern);
    }

    public RevisionPathDto getRevisionPath(String duration) {
        String normalized = duration == null ? "20min" : duration.toLowerCase().trim().replace("-", "").replace(" ", "");
        List<QuickPrepTopic> all = topicRepo.findByActiveTrueOrderByDisplayOrderAsc();
        if (all.isEmpty()) {
            return RevisionPathDto.builder()
                .duration(normalized)
                .title("Express Java Revision")
                .totalMinutes(20)
                .description("High-yield key Java and DSA concepts")
                .schedule(Collections.emptyList())
                .build();
        }

        List<RevisionPathScheduleItem> schedule = new ArrayList<>();
        int currentMinute = 0;

        if (normalized.contains("10")) {
            // 10-Minute Blitz: Core Java, OOP, Collections, Big-O, Quiz
            int[] pickIndices = {0, 4, 10, 14, 22};
            String[] customTimes = {"00:00", "02:00", "04:30", "07:00", "09:00"};
            for (int i = 0; i < pickIndices.length && i < all.size(); i++) {
                int idx = Math.min(pickIndices[i], all.size() - 1);
                QuickPrepTopic t = all.get(idx);
                schedule.add(RevisionPathScheduleItem.builder()
                    .timeStamp(i < customTimes.length ? customTimes[i] : String.format("%02d:00", currentMinute))
                    .topicId(t.getId())
                    .title(t.getTitle())
                    .category(t.getCategory() != null ? t.getCategory().getName() : "Java")
                    .durationMinutes(2)
                    .summary(t.getSummary())
                    .build());
                currentMinute += 2;
            }
            return RevisionPathDto.builder()
                .duration("10min")
                .title("10-Minute Java & DSA Power Blitz")
                .totalMinutes(10)
                .description("Ultra-fast refresher covering JVM essentials, OOP pillars, HashMap, Binary Search & Big-O.")
                .schedule(schedule)
                .build();
        } else if (normalized.contains("20")) {
            // 20-Minute Standard Revision
            int[] pickIndices = {0, 4, 9, 12, 14, 19, 21, 25};
            String[] times = {"00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "20:00"};
            for (int i = 0; i < pickIndices.length && i < all.size(); i++) {
                int idx = Math.min(pickIndices[i], all.size() - 1);
                QuickPrepTopic t = all.get(idx);
                schedule.add(RevisionPathScheduleItem.builder()
                    .timeStamp(i < times.length ? times[i] : String.format("%02d:00", currentMinute))
                    .topicId(t.getId())
                    .title(t.getTitle())
                    .category(t.getCategory() != null ? t.getCategory().getName() : "Java")
                    .durationMinutes(3)
                    .summary(t.getSummary())
                    .build());
                currentMinute += 3;
            }
            return RevisionPathDto.builder()
                .duration("20min")
                .title("20-Minute Core Java & Algorithm Revision")
                .totalMinutes(20)
                .description("The quintessential exam refresher: JVM, OOP, Strings, Arrays, Collections, Binary Search & Trees.")
                .schedule(schedule)
                .build();
        } else if (normalized.contains("30")) {
            // 30-Minute In-Depth Path
            int[] pickIndices = {0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24};
            for (int i = 0; i < pickIndices.length && i < all.size(); i++) {
                int idx = Math.min(pickIndices[i], all.size() - 1);
                QuickPrepTopic t = all.get(idx);
                schedule.add(RevisionPathScheduleItem.builder()
                    .timeStamp(String.format("%02d:00", currentMinute))
                    .topicId(t.getId())
                    .title(t.getTitle())
                    .category(t.getCategory() != null ? t.getCategory().getName() : "Java")
                    .durationMinutes(3)
                    .summary(t.getSummary())
                    .build());
                currentMinute += 3;
            }
            return RevisionPathDto.builder()
                .duration("30min")
                .title("30-Minute Comprehensive Revision Track")
                .totalMinutes(30)
                .description("Full-spectrum revision of Java memory, OOP, Strings, Collections, Linked Lists, BST and Sorting.")
                .schedule(schedule)
                .build();
        } else if (normalized.contains("1h") || normalized.contains("60")) {
            // 1 Hour Master Path
            for (int i = 0; i < Math.min(18, all.size()); i++) {
                QuickPrepTopic t = all.get(i);
                schedule.add(RevisionPathScheduleItem.builder()
                    .timeStamp(String.format("%02d:00", (i * 3)))
                    .topicId(t.getId())
                    .title(t.getTitle())
                    .category(t.getCategory() != null ? t.getCategory().getName() : "Java")
                    .durationMinutes(3)
                    .summary(t.getSummary())
                    .build());
            }
            return RevisionPathDto.builder()
                .duration("1hour")
                .title("1-Hour Complete Java & DSA Revision Masterclass")
                .totalMinutes(60)
                .description("Deep-dive across all core concepts, complex data structures, graph traversals and interview traps.")
                .schedule(schedule)
                .build();
        } else {
            // 2 Hours Complete Sprint
            for (int i = 0; i < all.size(); i++) {
                QuickPrepTopic t = all.get(i);
                schedule.add(RevisionPathScheduleItem.builder()
                    .timeStamp(String.format("%02d:%02d", (i * 4) / 60, (i * 4) % 60))
                    .topicId(t.getId())
                    .title(t.getTitle())
                    .category(t.getCategory() != null ? t.getCategory().getName() : "Java")
                    .durationMinutes(4)
                    .summary(t.getSummary())
                    .build());
            }
            return RevisionPathDto.builder()
                .duration("2hours")
                .title("2-Hour Complete Exam & Placement Revision Camp")
                .totalMinutes(120)
                .description("Every single topic, syntax pattern, Big-O proof, traversal, algorithm template and interview question.")
                .schedule(schedule)
                .build();
        }
    }

    public List<QuickPrepQuizQuestion> getQuizByTopic(Long topicId) {
        List<QuickPrepQuizQuestion> questions = quizRepo.findByTopicId(topicId);
        if (questions.isEmpty()) {
            // Fallback to related category or random sample
            QuickPrepTopic topic = getTopicById(topicId);
            if (topic.getCategory() != null) {
                questions = quizRepo.findByTopic_CategoryId(topic.getCategory().getId());
            }
        }
        return questions;
    }

    public List<QuickPrepQuizQuestion> getQuizByCategory(Long categoryId) {
        return quizRepo.findByTopic_CategoryId(categoryId);
    }

    public QuizResultResponse submitQuiz(QuizSubmissionRequest req) {
        if (req.getAnswers() == null || req.getAnswers().isEmpty()) {
            return QuizResultResponse.builder()
                .total(0)
                .score(0)
                .percentage(0.0)
                .strongTopics(Collections.emptyList())
                .weakTopics(Collections.emptyList())
                .recommendations(List.of("Take a quiz to identify weak points."))
                .build();
        }

        int score = 0;
        int total = req.getAnswers().size();
        Set<String> strong = new LinkedHashSet<>();
        Set<String> weak = new LinkedHashSet<>();

        for (QuizAnswerDto ans : req.getAnswers()) {
            QuickPrepQuizQuestion q = quizRepo.findById(ans.getQuestionId()).orElse(null);
            if (q != null) {
                String catName = q.getTopic() != null && q.getTopic().getCategory() != null
                    ? q.getTopic().getCategory().getName()
                    : "Java Core";
                if (q.getCorrectOption().trim().equalsIgnoreCase(ans.getSelectedOption().trim())) {
                    score++;
                    strong.add(catName);
                } else {
                    weak.add(catName);
                }
            }
        }

        double pct = Math.round(((double) score / total) * 100.0);
        List<String> recommendations = new ArrayList<>();
        if (weak.isEmpty()) {
            recommendations.add("Outstanding! You have mastered these concepts. Ready for your assessment.");
        } else {
            for (String w : weak) {
                recommendations.add("Review " + w + " syntax & key exam takeaways before testing.");
            }
        }

        return QuizResultResponse.builder()
            .total(total)
            .score(score)
            .percentage(pct)
            .strongTopics(new ArrayList<>(strong))
            .weakTopics(new ArrayList<>(weak))
            .recommendations(recommendations)
            .build();
    }

    public Map<String, Object> saveProgress(ProgressRequest req) {
        User user = userRepo.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        QuickPrepTopic topic = getTopicById(req.getTopicId());

        QuickPrepProgress progress = progressRepo.findByUserIdAndTopicId(user.getId(), topic.getId())
            .orElse(QuickPrepProgress.builder().user(user).topic(topic).build());

        progress.setCompleted(req.isCompleted());
        if (req.isCompleted()) {
            progress.setCompletedAt(LocalDateTime.now());
        }
        progressRepo.save(progress);

        long totalTopics = topicRepo.count();
        long completedCount = progressRepo.countByUserIdAndCompletedTrue(user.getId());
        double overallPct = totalTopics > 0 ? Math.round(((double) completedCount / totalTopics) * 100.0) : 0.0;

        Map<String, Object> res = new HashMap<>();
        res.put("topicId", topic.getId());
        res.put("completed", progress.isCompleted());
        res.put("completedCount", completedCount);
        res.put("totalTopics", totalTopics);
        res.put("overallProgressPct", overallPct);
        return res;
    }

    public List<Map<String, Object>> getProgress(Long userId) {
        List<QuickPrepProgress> list = progressRepo.findByUserId(userId);
        return list.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("topicId", p.getTopic().getId());
            m.put("topicTitle", p.getTopic().getTitle());
            m.put("category", p.getTopic().getCategory() != null ? p.getTopic().getCategory().getName() : "");
            m.put("completed", p.isCompleted());
            m.put("completedAt", p.getCompletedAt());
            return m;
        }).toList();
    }

    public Map<String, Object> toggleBookmark(BookmarkRequest req) {
        User user = userRepo.findById(req.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        QuickPrepTopic topic = getTopicById(req.getTopicId());

        Optional<QuickPrepBookmark> existing = bookmarkRepo.findByUserIdAndTopicId(user.getId(), topic.getId());
        boolean saved;
        if (existing.isPresent()) {
            bookmarkRepo.delete(existing.get());
            saved = false;
        } else {
            bookmarkRepo.save(QuickPrepBookmark.builder().user(user).topic(topic).build());
            saved = true;
        }

        Map<String, Object> res = new HashMap<>();
        res.put("topicId", topic.getId());
        res.put("bookmarked", saved);
        return res;
    }

    public List<Map<String, Object>> getBookmarks(Long userId) {
        List<QuickPrepBookmark> list = bookmarkRepo.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(b -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", b.getId());
            m.put("topicId", b.getTopic().getId());
            m.put("title", b.getTopic().getTitle());
            m.put("category", b.getTopic().getCategory() != null ? b.getTopic().getCategory().getName() : "");
            m.put("readTimeMinutes", b.getTopic().getReadTimeMinutes());
            m.put("summary", b.getTopic().getSummary());
            m.put("createdAt", b.getCreatedAt());
            return m;
        }).toList();
    }

    public void deleteBookmark(Long userId, Long topicId) {
        bookmarkRepo.deleteByUserIdAndTopicId(userId, topicId);
    }

    // Admin CRUD
    public List<QuickPrepTopic> adminGetAllTopics() {
        return topicRepo.findAllByOrderByDisplayOrderAsc();
    }

    public QuickPrepTopic adminCreateTopic(QuickPrepTopic topic, Long categoryId) {
        topic.setId(null);
        if (categoryId != null) {
            QuickPrepCategory cat = categoryRepo.findById(categoryId).orElse(null);
            topic.setCategory(cat);
        }
        return topicRepo.save(topic);
    }

    public QuickPrepTopic adminUpdateTopic(Long id, QuickPrepTopic update, Long categoryId) {
        QuickPrepTopic existing = getTopicById(id);
        existing.setTitle(update.getTitle());
        existing.setSummary(update.getSummary());
        existing.setContent(update.getContent());
        existing.setJavaExample(update.getJavaExample());
        existing.setRememberPoint(update.getRememberPoint());
        existing.setCommonMistake(update.getCommonMistake());
        existing.setTimeComplexity(update.getTimeComplexity());
        existing.setSpaceComplexity(update.getSpaceComplexity());
        existing.setReadTimeMinutes(update.getReadTimeMinutes());
        existing.setDisplayOrder(update.getDisplayOrder());
        existing.setActive(update.isActive());

        if (categoryId != null) {
            QuickPrepCategory cat = categoryRepo.findById(categoryId).orElse(null);
            existing.setCategory(cat);
        }
        return topicRepo.save(existing);
    }

    public void adminDeleteTopic(Long id) {
        topicRepo.deleteById(id);
    }

    public QuickPrepTopic adminToggleActive(Long id, boolean active) {
        QuickPrepTopic topic = getTopicById(id);
        topic.setActive(active);
        return topicRepo.save(topic);
    }

    public QuickPrepCategory adminCreateCategory(QuickPrepCategory cat) {
        cat.setId(null);
        return categoryRepo.save(cat);
    }
}
