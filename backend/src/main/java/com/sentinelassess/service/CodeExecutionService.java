package com.sentinelassess.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinelassess.dto.PracticeDtos.RunRequest;
import com.sentinelassess.dto.PracticeDtos.RunResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CodeExecutionService {
 private final RestClient client; private final ObjectMapper mapper=new ObjectMapper();
 public CodeExecutionService(@Value("${app.runlet.url}") String url){client=RestClient.builder().baseUrl(url).build();}
 public RunResponse run(RunRequest req,String stdin){
   try{
     String body=mapper.createObjectNode().put("language",req.language()).put("code",req.code()).put("stdin",stdin==null?"":stdin).toString();
     String raw=client.post().contentType(MediaType.APPLICATION_JSON).body(body).retrieve().body(String.class);
     JsonNode n=mapper.readTree(raw);
     return new RunResponse(n.path("status").asText(),n.path("stdout").asText(),n.path("stderr").asText(),n.path("time").asDouble(),n.path("memory").asLong());
   }catch(Exception e){return new RunResponse("SERVICE_ERROR","",e.getMessage(),0,0);}
 }
}
