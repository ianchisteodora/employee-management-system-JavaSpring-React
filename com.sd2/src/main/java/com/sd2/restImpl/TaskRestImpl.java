package com.sd2.restImpl;

import com.sd2.constents.Constants;
import com.sd2.model.Task;
import com.sd2.rest.TaskRest;
import com.sd2.service.TaskService;
import com.sd2.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class TaskRestImpl implements TaskRest {

    @Autowired
    TaskService taskService;

    @Override
    public ResponseEntity<String> addNewTask(Map<String, String> requestMap) {
        try{
            return taskService.addNewTask(requestMap);

        }catch(Exception e){
            e.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Task>> getAllTasks(String filterValue) {

        try{
            return taskService.getAllTasks(filterValue);

        }catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try{

            return taskService.update(requestMap);

        }catch(Exception e){
            e.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteTask(Integer id) {
        try{
            return taskService.deleteTask(id);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
