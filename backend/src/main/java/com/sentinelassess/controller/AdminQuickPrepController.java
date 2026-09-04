package com.sentinelassess.controller;

import com.sentinelassess.entity.QuickPrepCategory;
import com.sentinelassess.entity.QuickPrepTopic;
import com.sentinelassess.service.QuickPrepService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/quickprep/admin")
public class AdminQuickPrepController {
    private final QuickPrepService service;

    public AdminQuickPrepController(QuickPrepService service) {
        this.service = service;
    }

    @GetMapping("/topics")
    public List<Map<String, Object>> getAllTopics() {
        return service.adminGetAllTopics().stream().map(this::toAdminMap).toList();
    }

    @PostMapping("/topics")
    public Map<String, Object> createTopic(@RequestBody Map<String, Object> body) {
        Long categoryId = body.get("categoryId") != null ? Long.valueOf(body.get("categoryId").toString()) : null;
        QuickPrepTopic topic = QuickPrepTopic.builder()
            .title((String) body.get("title"))
            .slug((String) body.getOrDefault("slug", generateSlug((String) body.get("title"))))
            .summary((String) body.get("summary"))
            .content((String) body.get("content"))
            .javaExample((String) body.get("javaExample"))
            .rememberPoint((String) body.get("rememberPoint"))
            .commonMistake((String) body.get("commonMistake"))
            .timeComplexity((String) body.get("timeComplexity"))
            .spaceComplexity((String) body.get("spaceComplexity"))
            .readTimeMinutes(body.get("readTimeMinutes") != null ? Integer.parseInt(body.get("readTimeMinutes").toString()) : 3)
            .displayOrder(body.get("displayOrder") != null ? Integer.parseInt(body.get("displayOrder").toString()) : 0)
            .active(body.get("active") != null ? Boolean.parseBoolean(body.get("active").toString()) : true)
            .build();

        QuickPrepTopic saved = service.adminCreateTopic(topic, categoryId);
        return toAdminMap(saved);
    }

    @PutMapping("/topics/{id}")
    public Map<String, Object> updateTopic(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long categoryId = body.get("categoryId") != null ? Long.valueOf(body.get("categoryId").toString()) : null;
        QuickPrepTopic topic = QuickPrepTopic.builder()
            .title((String) body.get("title"))
            .slug((String) body.getOrDefault("slug", generateSlug((String) body.get("title"))))
            .summary((String) body.get("summary"))
            .content((String) body.get("content"))
            .javaExample((String) body.get("javaExample"))
            .rememberPoint((String) body.get("rememberPoint"))
            .commonMistake((String) body.get("commonMistake"))
            .timeComplexity((String) body.get("timeComplexity"))
            .spaceComplexity((String) body.get("spaceComplexity"))
            .readTimeMinutes(body.get("readTimeMinutes") != null ? Integer.parseInt(body.get("readTimeMinutes").toString()) : 3)
            .displayOrder(body.get("displayOrder") != null ? Integer.parseInt(body.get("displayOrder").toString()) : 0)
            .active(body.get("active") != null ? Boolean.parseBoolean(body.get("active").toString()) : true)
            .build();

        QuickPrepTopic updated = service.adminUpdateTopic(id, topic, categoryId);
        return toAdminMap(updated);
    }

    @DeleteMapping("/topics/{id}")
    public void deleteTopic(@PathVariable Long id) {
        service.adminDeleteTopic(id);
    }

    @PatchMapping("/topics/{id}/active")
    public Map<String, Object> toggleActive(@PathVariable Long id, @RequestParam boolean value) {
        QuickPrepTopic updated = service.adminToggleActive(id, value);
        return toAdminMap(updated);
    }

    @PostMapping("/categories")
    public QuickPrepCategory createCategory(@RequestBody QuickPrepCategory cat) {
        return service.adminCreateCategory(cat);
    }

    private String generateSlug(String title) {
        if (title == null) return "topic-" + System.currentTimeMillis();
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    private Map<String, Object> toAdminMap(QuickPrepTopic t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId());
        m.put("title", t.getTitle());
        m.put("slug", t.getSlug());
        m.put("summary", t.getSummary());
        m.put("category", t.getCategory() != null ? t.getCategory().getName() : "");
        m.put("categoryId", t.getCategory() != null ? t.getCategory().getId() : null);
        m.put("timeComplexity", t.getTimeComplexity());
        m.put("spaceComplexity", t.getSpaceComplexity());
        m.put("readTimeMinutes", t.getReadTimeMinutes());
        m.put("displayOrder", t.getDisplayOrder());
        m.put("active", t.isActive());
        m.put("content", t.getContent());
        m.put("javaExample", t.getJavaExample());
        m.put("rememberPoint", t.getRememberPoint());
        m.put("commonMistake", t.getCommonMistake());
        return m;
    }
}
