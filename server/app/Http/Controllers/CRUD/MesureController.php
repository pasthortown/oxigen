<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Mesure;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MesureController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Mesure::get(),200);
       } else {
          $mesure = Mesure::findOrFail($id);
          $attach = [];
          return response()->json(["Mesure"=>$mesure, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Mesure::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $mesure = new Mesure();
          $lastMesure = Mesure::orderBy('id')->get()->last();
          if($lastMesure) {
             $mesure->id = $lastMesure->id + 1;
          } else {
             $mesure->id = 1;
          }
          $mesure->sensor_value = $result['sensor_value'];
          $mesure->moment = $result['moment'];
          $mesure->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($mesure,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $mesure = Mesure::where('id',$result['id'])->update([
             'sensor_value'=>$result['sensor_value'],
             'moment'=>$result['moment'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($mesure,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Mesure::destroy($id);
    }

    function backup(Request $data)
    {
       $mesures = Mesure::get();
       $toReturn = [];
       foreach( $mesures as $mesure) {
          $attach = [];
          array_push($toReturn, ["Mesure"=>$mesure, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['Mesure'];
         $exist = Mesure::where('id',$result['id'])->first();
         if ($exist) {
           Mesure::where('id', $result['id'])->update([
             'sensor_value'=>$result['sensor_value'],
             'moment'=>$result['moment'],
           ]);
         } else {
          $mesure = new Mesure();
          $mesure->id = $result['id'];
          $mesure->sensor_value = $result['sensor_value'];
          $mesure->moment = $result['moment'];
          $mesure->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}