<?php

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class PlayerController extends AbstractActionController {

    /**
     *
     * @var Application\Models\Musics
     */
    private $musics;

    public function indexAction() {
        
    }

    public function searchAction() {
        
        $success = false;

        //rdio service configured
        $this->musics = $this->getServiceLocator()->get('Application\Musics');
        
        $query = $this->params()->fromQuery("query");

        $return = $this->musics->search($query);

        return $this->response;
    }

    public function playbacktokenAction() {
        $this->musics = $this->getServiceLocator()->get('Application\Musics');

        $token = $this->musics->getPlaybackToken($_SERVER["HTTP_HOST"]);
        
    }

}
