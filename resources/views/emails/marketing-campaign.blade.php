@extends('emails.layout')

@section('content')
    {!! $send->body_html !!}

    <img src="{{ route('marketing-campaigns.open', $send->open_token) }}" alt="" width="1" height="1" style="display:none;width:1px;height:1px;border:0;">
@endsection
