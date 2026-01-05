<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::get('/', function () {
    return view('index');
})->name('home');

Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
