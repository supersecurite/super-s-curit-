@extends('emails.layout')

@section('content')
    {!! $message->body_html !!}
@endsection
