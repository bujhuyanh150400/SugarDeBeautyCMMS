<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Models\Rank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RankController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    public function list(): Response
    {
        $ranks = Rank::orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);

        return Inertia::render('Rank/List', [
            'title' => "Quản lý cấp bậc",
            'ranks' => fn() => $ranks,
        ]);
    }
    public function view_add(): Response
    {
        $title = "Thêm cấp bậc mới";
        return Inertia::render('Rank/Add', [
            'title' => $title,
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required',
                'description' => [
                    function ($attribute, $value, $fail) {
                        $value = trim(strip_tags($value));
                        if (empty($value)) {
                            $fail('Vui lòng nhập mô tả');
                        }
                    }
                ],
                'percent_rank' => ['required', 'integer', 'min:0'],
            ],
            [
                'title.required' => 'Tiêu đề là bắt buộc.',
                'percent_rank.required' => 'Phần trăm  là bắt buộc.',
                'percent_rank.integer' => 'Phần trăm phải là một số nguyên.',
                'percent_rank.min' => 'Phần trăm phải lớn hơn hoặc bằng 0.',
            ]
        );
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'percent_rank' => $request->integer('percent_rank'),
        ];
        $rank = Rank::create($data);
        if ($rank) {
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('rank.list');
        } else {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view_edit(int $rank_id): Response|RedirectResponse
    {
        $rank = Rank::find($rank_id);
        if ($rank) {
            $title = "Sửa cấp bậc: " . $rank->title;
            return Inertia::render('Rank/Edit', [
                'title' => $title,
                'rank' => $rank
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy dữ liệu');
            return redirect()->back();
        }
    }
    public function edit(int $rank_id, Request $request): RedirectResponse
    {
        $rank = Rank::find($rank_id);
        if ($rank) {
            $validator = Validator::make(
                $request->all(),
                [
                    'title' => 'required',
                    'description' => [
                        function ($attribute, $value, $fail) {
                            $value = trim(strip_tags($value));
                            if (empty($value)) {
                                $fail('Vui lòng nhập mô tả');
                            }
                        }
                    ],
                    'percent_rank' => ['required', 'integer', 'min:0'],
                ],
                [
                    'title.required' => 'Tiêu đề là bắt buộc.',
                    'percent_rank.required' => 'Phần trăm  là bắt buộc.',
                    'percent_rank.integer' => 'Phần trăm phải là một số nguyên.',
                    'percent_rank.min' => 'Phần trăm phải lớn hơn hoặc bằng 0.',
                ]
            );
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            $rank->title = $request->input('title');
            $rank->description = $request->input('description');
            $rank->percent_rank = $request->integer('percent_rank');
            $rank->save();
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('rank.list');
        } else {
            session()->flash('error', 'Không tìm thấy dữ liệu');
            return redirect()->back();
        }
    }


}
