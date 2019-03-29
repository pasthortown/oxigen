<?php

class serverPHP
{
    private $data_base;
    private $Conexion;

    public function __construct($data_base) {
        $this->data_base = $data_base;
    }

    public function getRegisters() {
        $moment =  date("Y-m-d");
        $sql = "SELECT * FROM MesureRegisters WHERE moment BETWEEN '".$moment." 00:00:00' AND '".$moment." 23:59:59' ORDER BY moment ASC;";
        $parameters = [];
        return $this->ejecutarConsulta($sql, $parameters);
    }

    public function register($args) {
        $sensor_value = $args["mesure"];
        $moment =  date("Y-m-d H:i:s");
        $sql = "INSERT INTO MesureRegisters (mesure, moment) VALUES (?,?);";
        $parameters = [$sensor_value, $moment];
        return $this->ejecutarConsulta($sql, $parameters);
    }

    protected function conectar(){
        try 
        {
            $this->Conexion = new PDO("mysql:host=".$this->data_base["servidor"].";dbname=".$this->data_base["base_datos"].";charset=utf8", $this->data_base["usuario"], $this->data_base["clave"],array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
            return true;
        }
        catch (PDOException $e) 
        {
            return false;
        }
    }
    
    protected function desconectar(){
        $this->Conexion = null;
    }

    protected function consultar($sql,$parametros){
        $stmt = $this->Conexion->prepare($sql);
        $stmt->execute($parametros);
        $array = array();
        $cuenta = $stmt->rowCount();
        if($cuenta>0){
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
            {
                $array[]=$row;
            }
        }else{
            $array[]=$cuenta;
        }
        return $array;
    }

    public function ejecutarConsulta($sql,$parametros){
        $this->conectar();
        $salida = $this->consultar($sql,$parametros);
        $this->desconectar();
        return $salida;
    }
}