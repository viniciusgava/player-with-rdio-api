<?php

namespace Application\Models;

use Application\Rdio\Rdio,
    Application\Tools\SecondToTime;

class Musics {

    use SecondToTime;

    /**
     *
     * @var Application\Rdio\Rdio
     */
    private $rdio;

    function __construct($rdioService) {
        $this->rdio = $rdioService;
    }

    public function search($query) {
        //make search
        $results = $this->rdio->search(array(
            "query" => $query,
            "types" => "Track"//Artist,Album,
        ));
        
        $return = array();

        if ($results->result->number_results > 0) {
            //filter data
            foreach ($results->result->results as $res) {
                $part = array();
                $part['icon'] = $res->baseIcon;
                $part['key'] = $res->key;
                switch ($res->type) {
                    case 'r': {
                            $part['type'] = 'artist';
                            break;
                        }
                    case 'a': {
                            $part['type'] = 'album';
                            $part['title'] = $res->artist . ' - ' . $res->album;
                            break;
                        }
                    case 't': {
                            $part['type'] = 'track';
                            $part['title'] = $res->name;
                            $part['duration'] = $this->secondToTime($res->duration);
                            $part['additional_info'] = $res->album;
                            $part['additional_info2'] = $res->artist;
                            break;
                        }
                }
                $return[] = $part;
            }
        }
        return $return;
    }

    public function getPlaybackToken($domain = null) {
        $arr = array();
        if (!is_null($domain))
            $arr['domain'] = $domain;
        return $this->rdio->getPlaybackToken($arr);
    }

}
