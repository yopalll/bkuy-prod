<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseGoalController extends Controller
{
    public function store(Request $request, Course $course): JsonResponse
    {
        abort_unless($course->instructor_id === Auth::id(), 403);

        $request->validate(['goal' => 'required|string|max:200']);

        $goal = $course->goals()->create(['goal' => $request->goal]);

        return response()->json(['id' => $goal->id, 'goal' => $goal->goal]);
    }

    public function destroy(Course $course, CourseGoal $goal): JsonResponse
    {
        abort_unless($course->instructor_id === Auth::id(), 403);
        abort_unless($goal->course_id === $course->id, 403);

        $goal->delete();

        return response()->json(['success' => true]);
    }
}
