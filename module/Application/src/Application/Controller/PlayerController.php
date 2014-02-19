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
use Application\Tools\AjaxResponse;

class PlayerController extends AbstractActionController {
    use AjaxResponse;

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

        return $this->ajaxResponse(true,$return);
    }

    public function playbacktokenAction() {
        $this->musics = $this->getServiceLocator()->get('Application\Musics');

        $domain = parse_url($_SERVER['HTTP_HOST'],PHP_URL_HOST);
                
        $token = $this->musics->getPlaybackToken($domain);
                
        return $this->ajaxResponse(true,['domain' => $domain, 'token' => $token->result]);
        
    }

}
