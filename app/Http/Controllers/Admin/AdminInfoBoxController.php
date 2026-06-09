<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfoBox;
use App\Http\Requests\Admin\StoreInfoBoxRequest;
use App\Http\Requests\Admin\UpdateInfoBoxRequest;
use Inertia\Inertia;

class AdminInfoBoxController extends Controller
{
    public function index()
    {
        $infoBoxes = InfoBox::orderBy('order_position')->paginate(15);
        return Inertia::render('Admin/InfoBoxes/Index', compact('infoBoxes'));
    }

    public function create()
    {
        return redirect()->route('admin.info-boxes.index');
    }

    public function store(StoreInfoBoxRequest $request)
    {
        InfoBox::create($request->validated());

        return redirect()->route('admin.info-boxes.index')->with('success', 'Info Box berhasil ditambahkan.');
    }

    public function edit(InfoBox $infoBox)
    {
        $infoBoxes = InfoBox::orderBy('order_position')->paginate(15);
        return Inertia::render('Admin/InfoBoxes/Index', [
            'infoBoxes'   => $infoBoxes,
            'editInfoBox' => $infoBox,
        ]);
    }

    public function update(UpdateInfoBoxRequest $request, InfoBox $infoBox)
    {
        $infoBox->update($request->validated());

        return redirect()->route('admin.info-boxes.index')->with('success', 'Info Box berhasil diperbarui.');
    }

    public function destroy(InfoBox $infoBox)
    {
        $infoBox->delete();

        return redirect()->route('admin.info-boxes.index')->with('success', 'Info Box berhasil dihapus.');
    }
}
