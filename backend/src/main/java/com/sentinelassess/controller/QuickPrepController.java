package com.sentinelassess.controller;

import com.sentinelassess.dto.QuickPrepDtos.*;
import com.sentinelassess.entity.QuickPrepCategory;
import com.sentinelassess.entity.QuickPrepQuizQuestion;
import com.sentinelassess.entity.QuickPrepTopic;
import com.sentinelassess.service.QuickPrepService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/quickprep")
public class QuickPrepController {
    private final QuickPrepService service;

    public QuickPrepController(QuickPrepService service) {
        this.service = service;
    }

    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return service.getCategories().stream().map(this::categoryToMap).toList();
    }

    @GetMapping("/topics")
    public List<Map<String, Object>> getTopics(@RequestParam(required = false) Long categoryId) {
        return service.getTopics(categoryId).stream().map(this::topicToSummaryMap).toList();
    }

    @GetMapping("/topics/{id}")
    public Map<String, Object> getTopic(@PathVariable Long id) {
        QuickPrepTopic t = service.getTopicById(id);
        return topicToDetailMap(t);
    }

    @GetMapping("/search")
    public List<Map<String, Object>> search(@RequestParam(required = false, defaultValue = "") String q) {
        return service.searchTopics(q).stream().map(this::topicToSummaryMap).toList();
    }

    @GetMapping("/paths/{duration}")
    public RevisionPathDto getRevisionPath(@PathVariable String duration) {
        return service.getRevisionPath(duration);
    }

    @GetMapping("/quiz/{topicId}")
    public List<Map<String, Object>> getQuizByTopic(@PathVariable Long topicId) {
        return service.getQuizByTopic(topicId).stream().map(this::quizToMap).toList();
    }

    @GetMapping("/quiz/category/{categoryId}")
    public List<Map<String, Object>> getQuizByCategory(@PathVariable Long categoryId) {
        return service.getQuizByCategory(categoryId).stream().map(this::quizToMap).toList();
    }

    @PostMapping("/quiz/submit")
    public QuizResultResponse submitQuiz(@RequestBody QuizSubmissionRequest request) {
        return service.submitQuiz(request);
    }

    @PostMapping("/progress")
    public Map<String, Object> saveProgress(@RequestBody ProgressRequest request) {
        return service.saveProgress(request);
    }

    @GetMapping("/progress")
    public List<Map<String, Object>> getProgress(@RequestParam Long userId) {
        return service.getProgress(userId);
    }

    @PostMapping("/bookmarks")
    public Map<String, Object> toggleBookmark(@RequestBody BookmarkRequest request) {
        return service.toggleBookmark(request);
    }

    @GetMapping("/bookmarks")
    public List<Map<String, Object>> getBookmarks(@RequestParam Long userId) {
        return service.getBookmarks(userId);
    }

    @DeleteMapping("/bookmarks/{topicId}")
    public void deleteBookmark(@RequestParam Long userId, @PathVariable Long topicId) {
        service.deleteBookmark(userId, topicId);
    }

    // Helper mappers
    private Map<String, Object> categoryToMap(QuickPrepCategory c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("name", c.getName());
        m.put("slug", c.getSlug());
        m.put("icon", c.getIcon());
        m.put("description", c.getDescription());
        m.put("displayOrder", c.getDisplayOrder());
        m.put("topicCount", c.getTopics() != null ? c.getTopics().size() : 0);
        return m;
    }

    private Map<String, Object> topicToSummaryMap(QuickPrepTopic t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId());
        m.put("title", t.getTitle());
        m.put("slug", t.getSlug());
        m.put("summary", t.getSummary());
        m.put("category", t.getCategory() != null ? t.getCategory().getName() : "");
        m.put("categoryId", t.getCategory() != null ? t.getCategory().getId() : null);
        m.put("categoryIcon", t.getCategory() != null ? t.getCategory().getIcon() : "⚡");
        m.put("timeComplexity", t.getTimeComplexity());
        m.put("spaceComplexity", t.getSpaceComplexity());
        m.put("readTimeMinutes", t.getReadTimeMinutes());
        m.put("displayOrder", t.getDisplayOrder());
        m.put("active", t.isActive());
        return m;
    }

    private Map<String, Object> topicToDetailMap(QuickPrepTopic t) {
        Map<String, Object> m = topicToSummaryMap(t);
        m.put("content", t.getContent());
        m.put("javaExample", t.getJavaExample());
        m.put("rememberPoint", t.getRememberPoint());
        m.put("commonMistake", t.getCommonMistake());
        m.put("quizQuestions", t.getQuizQuestions() != null ? t.getQuizQuestions().stream().map(this::quizToMap).toList() : Collections.emptyList());
        return m;
    }

    private Map<String, Object> quizToMap(QuickPrepQuizQuestion q) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", q.getId());
        m.put("topicId", q.getTopic() != null ? q.getTopic().getId() : null);
        m.put("topicTitle", q.getTopic() != null ? q.getTopic().getTitle() : null);
        m.put("question", q.getQuestion());
        m.put("optionsJson", q.getOptionsJson());
        m.put("correctOption", q.getCorrectOption());
        m.put("explanation", q.getExplanation());
        m.put("questionType", q.getQuestionType());
        return m;
    }
}
