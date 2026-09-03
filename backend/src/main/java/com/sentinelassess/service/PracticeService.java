package com.sentinelassess.service;

import com.sentinelassess.entity.*;
import com.sentinelassess.repository.*;
import com.sentinelassess.dto.PracticeDtos.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PracticeService {
 private final PracticeQuestionRepository questions; private final PracticeTestCaseRepository tests;
 private final PracticeSubmissionRepository submissions; private final PracticeProgressRepository progress;
 private final UserRepository users; private final CodeExecutionService executor;

 public PracticeService(PracticeQuestionRepository q,PracticeTestCaseRepository t,PracticeSubmissionRepository s,
   PracticeProgressRepository p,UserRepository u,CodeExecutionService e){questions=q;tests=t;submissions=s;progress=p;users=u;executor=e;}

 public List<PracticeQuestion> list(){return questions.findByActiveTrue();}
 public PracticeQuestion get(Long id){return questions.findById(id).orElseThrow();}
 public RunResponse run(Long id,RunRequest req){
   PracticeQuestion q=get(id);
   return executor.run(req,q.getSampleInput());
 }
 public Map<String,Object> submit(Long id,Long userId,RunRequest req){
   PracticeQuestion q=get(id); List<PracticeTestCase> tc=tests.findByPracticeQuestionId(id);
   int passed=0; double maxTime=0; long maxMemory=0;
   for(PracticeTestCase t:tc){
     RunResponse r=executor.run(req,t.getInput());
     maxTime=Math.max(maxTime,r.time()); maxMemory=Math.max(maxMemory,r.memory());
     if("OK".equalsIgnoreCase(r.status()) && normalize(r.stdout()).equals(normalize(t.getExpectedOutput()))) passed++;
     else if(!"OK".equalsIgnoreCase(r.status())) break;
   }
   boolean accepted=!tc.isEmpty()&&passed==tc.size();
   int points=accepted ? switch(q.getDifficulty()){case EASY->5;case MEDIUM->10;case HARD->15;} : 0;
   User u=users.findById(userId).orElseThrow();
   submissions.save(PracticeSubmission.builder().user(u).practiceQuestion(q).language(req.language()).code(req.code())
     .status(accepted?"ACCEPTED":"WRONG_ANSWER").passedTests(passed).totalTests(tc.size())
     .runtime(maxTime).memory(maxMemory).pointsAwarded(points).build());
   PracticeProgress pp=progress.findByUserIdAndPracticeQuestionId(userId,id).orElse(
     PracticeProgress.builder().user(u).practiceQuestion(q).build());
   pp.setAttempts(pp.getAttempts()+1); pp.setLastSubmittedAt(java.time.LocalDateTime.now());
   if(accepted&&!pp.isSolved()){pp.setSolved(true);pp.setPointsEarned(points);}
   if(pp.getBestRuntime()==0||maxTime<pp.getBestRuntime())pp.setBestRuntime(maxTime);
   progress.save(pp);
   return Map.of("status",accepted?"ACCEPTED":"WRONG_ANSWER","passedTests",passed,"totalTests",tc.size(),
     "points",points,"runtime",maxTime,"memory",maxMemory);
 }
 private String normalize(String s){return s==null?"":s.replace("\r\n","\n").trim();}
}
