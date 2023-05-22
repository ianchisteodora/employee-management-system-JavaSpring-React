package com.sd2.serviceImpl;

import com.sd2.JWT.JwtFilter;
import com.sd2.constents.Constants;
import com.sd2.dao.TaskDao;
import com.sd2.model.Task;
import com.sd2.model.User;
import com.sd2.service.TaskService;
import com.sd2.utils.Utils;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    TaskDao taskDao;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> addNewTask(Map<String, String> requestMap) {
        try{

            if(jwtFilter.isAdmin()){

                if(validateTaskMap(requestMap, false)){

                    taskDao.save(getTaskFromMap(requestMap, false));
                    return Utils.getResponseEntity("Task added successfully", HttpStatus.OK);


                }


            }else{
                return Utils.getResponseEntity(Constants.un_access, HttpStatus.UNAUTHORIZED);
            }


        }catch(Exception e){
            e.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    private boolean validateTaskMap(Map<String, String> requestMap, boolean validateId) {

        if(requestMap.containsKey("name")){
            if(requestMap.containsKey("id") && validateId){
                return true;
            }
            else if (!validateId){
                return true;
            }

        }
        return false;

    }



    private Task getTaskFromMap(Map<String, String> requestMap, Boolean isAdd){
        Task task = new Task();
        if(isAdd){
            task.setId(Integer.parseInt(requestMap.get("id")));

        }
        task.setName(requestMap.get("name"));
        task.setDescription(requestMap.get("description"));
        task.setDueDate(requestMap.get("dueDate"));
        task.setEmployee((requestMap.get("employee")));
        task.setStatus("false");
        return task;
    }

    @Override
    public ResponseEntity<List<Task>> getAllTasks(String filterValue) {

        try{

            if(!Strings.isEmpty(filterValue) && filterValue.equalsIgnoreCase("true")){
                return new ResponseEntity<List<Task>>(taskDao.getAllTasks(), HttpStatus.OK);

            }
            return new ResponseEntity<>(taskDao.findAll(), HttpStatus.OK);

        }catch(Exception e){
            e.printStackTrace();
        }

        return new ResponseEntity<List<Task>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isUser()){

                Optional<Task> optional =  taskDao.findById(Integer.parseInt(requestMap.get("id")));
                if(!optional.isEmpty()){

                    taskDao.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    return Utils.getResponseEntity("Task completed!", HttpStatus.OK);

                }
                else {
                    Utils.getResponseEntity("Task id doesn't exist", HttpStatus.OK);

                }


            }else{
                return Utils.getResponseEntity(Constants.un_access, HttpStatus.UNAUTHORIZED);
            }

        }catch(Exception e){
            e.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteTask(Integer id) {
        try{
            if(jwtFilter.isAdmin()){
                Optional optional =  taskDao.findById(id);
                if(!optional.isEmpty()){
                    taskDao.deleteById(id);
                    return Utils.getResponseEntity("Task Deleted Successfully", HttpStatus.OK);
                }else{
                    return Utils.getResponseEntity("Task id does not exist", HttpStatus.OK);
                }
            }else{
                return Utils.getResponseEntity(Constants.un_access, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
