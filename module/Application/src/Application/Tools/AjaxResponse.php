<?php

namespace Application\Tools;
use Zend\View\Model\JsonModel;

trait AjaxResponse {
    
    protected function ajaxResponse($success, $arrResult, $msg = ""){
        $arr = array(
            'success' => $success,
            'msg' => $msg,
            'result' => $arrResult
        );
        
        return new JsonModel($arr);
    }
    
}