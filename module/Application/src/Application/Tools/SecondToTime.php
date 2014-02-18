<?php

namespace Application\Tools;


trait SecondToTime {
    
    protected function secondToTime($seconds){
        
        
        $minutes = intval($seconds/60);
        $seconds = intval($seconds%60);
        $minutes = intval($minutes%60);
        $hours = intval($minutes/60);        
        
        $time = [];
        
        if($hours > 0)
           $time[] = $this->zerofill($hours);
        
        if($minutes > 0)
           $time[] = $this->zerofill($minutes);
        else
            $time[] = "00";
        
        if($seconds > 0)
           $time[] = $this->zerofill($seconds);
        return implode(":", $time);
    }
    
    private function zerofill($number){
        return sprintf('%02d', $number);
    }
    
}