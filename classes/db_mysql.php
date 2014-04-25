<?php
class db {
	static function connect() {
		if (!mysql_connect('localhost', 'root', 'admin'))//if (!mysql_connect(config::$db_host, config::$db_user, config::$db_pass))
			throw new ErrorException;
		else {
			mysql_select_db('openmusiclibrary');
			mysql_set_charset('utf8');
		}
	}
	
	protected static function query($sql) {
		if (!($r = mysql_query($sql)))
			throw new ErrorException(mysql_error().': '.$sql);
		return $r;
	}
	
	static function full_quote_str($str) {
		self::connect();
		return '\''.mysql_real_escape_string($str).'\'';
	}
	
	// condition may be an array, a string (escape!) or an id
	protected static function condition($condition_data) {
		if (is_array($condition_data)) {
			$cond = '1=1';
			foreach ($condition_data as $k => $v)
				$cond .= ' AND `'.$k.'` = '.self::full_quote_str($v);
			return $cond;
		} elseif (is_numeric($condition_data))
			return 'id='.$condition_data;
		elseif (is_string($condition_data))
			return $condition_data;
		
		throw new ErrorException;
	}
	
	static function insert($table, $kv_array, $get = false) {
		self::connect();
		
		if (!is_array($kv_array) || !count($kv_array)) throw new ErrorException;
		
		$keys = '';
		$values = '';
		foreach ($kv_array as $k => $v) {
			$keys .= '`'.$k.'`, ';
			$values .= self::full_quote_str($v).', ';
		}
		
		self::query('INSERT INTO `'.$table.'` ('.substr($keys, 0, -2).') VALUES ('.substr($values, 0, -2).')');
		
		return $get?self::get($table, mysql_insert_id()):mysql_insert_id();
	}
    
    static function buildSelect($fields, $table, $condition, $order = '', $limit = '', $group_by = '') {
        $tables_q = array();
        $tables_d = array();
        if (is_array($table))
            foreach ($table as $key => $t) {
                $tables_q[] = '`'.$t.'`'.(is_string($key)?' as '.$key:'');
                $tables_d[] = '`'.(is_string($key)?$key:$t).'`.deleted = 0';
            }
        else {
            $tables_q[] = '`'.$table.'`';
            $tables_d[] = '`'.$table.'`.deleted = 0';
        }
        
        return 'SELECT '.$fields.' FROM '.implode(',', $tables_q).' WHERE '.self::condition($condition).' AND '.implode(' AND ', $tables_d).(strlen($group_by)?(' GROUP BY '.$group_by):'').(strlen($order)?(' ORDER BY '.$order):'').(strlen($limit)?(' LIMIT '.$limit):'');
    }
	
	protected static function _get($fields, $table, $condition, $order, $limit, $group_by, $all = false) {
		self::connect();
        
		$q = self::query(self::buildSelect($fields, $table, $condition, $order, $limit, $group_by));

		if (!$all) {
			$r = mysql_fetch_assoc($q);
			return $r;
		}
		
		$r = array();
		while ($n = mysql_fetch_assoc($q)) {
			$r[] = $n;
		}
		return $r;
	}
	
	static function get($table, $condition = array(), $order = '', $limit = '', $group_by = '') {
		return self::_get('*', $table, $condition, $order, $limit, $group_by);
	}
	
	static function getAll($table, $condition = array(), $order = '', $limit = '', $group_by = '') {
		return self::_get('*', $table, $condition, $order, $limit, $group_by, true);
	}
	
	static function getFields($fields, $table, $condition=array(), $order = '', $limit = '', $group_by = '') {
		return self::_get($fields, $table, $condition, $order, $limit, $group_by);	
	}
	
	static function getFieldsAll($fields, $table, $condition=array(), $order = '', $limit = '', $group_by = '') {
		return self::_get($fields, $table, $condition, $order, $limit, $group_by, true);
	}
	
	static function update($table, $kv_array, $condition) {
		self::connect();
		
		if (!is_array($kv_array) || !count($kv_array)) throw new ErrorException;
		
		$values = '';
		foreach ($kv_array as $k => $v)
			$values .= '`'.$k.'` = '.self::full_quote_str($v).', ';
		
		self::query('UPDATE `'.$table.'` SET '.substr($values, 0, -2).' WHERE '.self::condition($condition).' AND deleted = 0');
		
		return mysql_affected_rows();
	}
	
	static function direct_update($table, $data, $condition) {
          self::connect();
          
          if(!isset($data) || $data == '') throw new ErrorException;
          
          self::query('UPDATE `'.$table.'` SET '.$data.' WHERE '.self::condition($condition));
          
          return mysql_affected_rows();
     }
	
	static function delete($table, $condition = array()) {
		self::connect();
		
		self::update($table , array('deleted' => 1), $condition);
		return mysql_affected_rows();
	}
}

